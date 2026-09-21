from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException, Request, Depends
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, BeforeValidator
from typing import Annotated, List, Optional
try:
    from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone
except ImportError:
    LlmChat = None
    UserMessage = None
    TextDelta = None
    StreamDone = None

import os
import logging
import uuid
import json
import re
import csv
import io
import time
import hmac
import jwt
from pathlib import Path
from datetime import datetime, timezone, timedelta

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("allulu-backend")

from data import COMPANY, CATEGORIES, PRODUCTS, PRODUCT_INDEX

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=2000)
db = client[os.environ.get('DB_NAME', 'allulu_packaging')]

# ---------- Local file-based storage fallback ----------
LOCAL_DATA_DIR = ROOT_DIR / "local_data"
LOCAL_DATA_DIR.mkdir(exist_ok=True)
QUOTES_FILE = LOCAL_DATA_DIR / "quotes.json"
CONTACTS_FILE = LOCAL_DATA_DIR / "contacts.json"


def _load_json(file_path: Path) -> list:
    if not file_path.exists():
        return []
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error reading {file_path}: {e}")
        return []


def _save_json(file_path: Path, data: list):
    try:
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, default=str)
    except Exception as e:
        logger.error(f"Error writing to {file_path}: {e}")

# ---------- Emergent object storage ----------
import requests
from fastapi import Response

STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
STORAGE_KEY = None
APP_NAME = "allulu-packaging"


def init_storage(force=False):
    global STORAGE_KEY
    if STORAGE_KEY and not force:
        return STORAGE_KEY
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": os.environ.get("EMERGENT_LLM_KEY")}, timeout=30)
    resp.raise_for_status()
    STORAGE_KEY = resp.json()["storage_key"]
    return STORAGE_KEY


def put_object(path, data, content_type):
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data, timeout=120,
    )
    resp.raise_for_status()
    return resp.json()

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- helpers ----------
PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v))]

def from_mongo(doc: dict) -> dict:
    doc = dict(doc)
    doc['id'] = str(doc.pop('_id', ''))
    return doc


class QuoteCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    company: str
    email: str
    phone: str
    product: str = ""
    quantity: str = ""
    size_spec: str = ""
    delivery_location: str = ""
    required_date: str = ""
    notes: str = ""


class ContactCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    email: str
    phone: str = ""
    message: str


class RockyChat(BaseModel):
    model_config = ConfigDict(extra="ignore")
    session_id: str
    message: str


# ---------- core ----------
@api_router.get("/")
async def root():
    return {"message": "Al Lulu Packaging API", "status": "ok"}


@api_router.get("/products")
async def get_products():
    return {"products": PRODUCTS, "categories": CATEGORIES}


@api_router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = PRODUCT_INDEX.get(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@api_router.post("/quote")
async def create_quote(
    name: str = Form(...),
    company: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    product: str = Form(""),
    quantity: str = Form(""),
    size_spec: str = Form(""),
    delivery_location: str = Form(""),
    required_date: str = Form(""),
    notes: str = Form(""),
    file: Optional[UploadFile] = File(None),
):
    if not name.strip() or not company.strip():
        raise HTTPException(status_code=422, detail="Name and company are required")
    if not re.match(r"[^@\s]+@[^@\s]+\.[^@\s]+", email or ""):
        raise HTTPException(status_code=422, detail="A valid email is required")

    doc = {
        "name": name.strip(), "company": company.strip(), "email": email.strip(),
        "phone": phone.strip(), "product": product.strip(), "quantity": quantity.strip(),
        "size_spec": size_spec.strip(), "delivery_location": delivery_location.strip(),
        "required_date": required_date.strip(), "notes": notes.strip(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "file_name": None,
    }

    if file and file.filename:
        data = await file.read()
        ext = file.filename.split(".")[-1].lower() if "." in file.filename else "bin"
        unique_name = f"{uuid.uuid4().hex}.{ext}"
        try:
            path = f"{APP_NAME}/uploads/quotes/{unique_name}"
            result = put_object(path, data, file.content_type or "application/octet-stream")
            doc["file_name"] = file.filename[:120]
            doc["file_path"] = result.get("path", path)
        except Exception as e:
            logger.warning(f"Remote storage unavailable ({e}), saving file locally.")
            local_upload_dir = ROOT_DIR / "uploads"
            local_upload_dir.mkdir(exist_ok=True)
            local_file_path = local_upload_dir / unique_name
            try:
                with open(local_file_path, "wb") as f_out:
                    f_out.write(data)
                doc["file_name"] = file.filename[:120]
                doc["file_path"] = f"local:{unique_name}"
            except Exception as write_err:
                logger.error(f"Local file write failed: {write_err}")

    try:
        result = await db.quotes.insert_one(doc)
        inserted_id = str(result.inserted_id)
    except Exception as e:
        logger.warning(f"MongoDB unavailable ({e}), persisting quote to local JSON storage.")
        inserted_id = str(uuid.uuid4())
        doc["_id"] = inserted_id
        items = _load_json(QUOTES_FILE)
        items.insert(0, doc)
        _save_json(QUOTES_FILE, items)

    return {"ok": True, "id": inserted_id}


@api_router.post("/contact")
async def create_contact(input: ContactCreate):
    if not input.name.strip() or not input.message.strip():
        raise HTTPException(status_code=422, detail="Name and message are required")
    if not re.match(r"[^@\s]+@[^@\s]+\.[^@\s]+", input.email or ""):
        raise HTTPException(status_code=422, detail="A valid email is required")
    doc = input.model_dump()
    doc.update({"name": input.name.strip(), "created_at": datetime.now(timezone.utc).isoformat()})
    try:
        result = await db.contacts.insert_one(doc)
        inserted_id = str(result.inserted_id)
    except Exception as e:
        logger.warning(f"MongoDB unavailable ({e}), persisting contact to local JSON storage.")
        inserted_id = str(uuid.uuid4())
        doc["_id"] = inserted_id
        items = _load_json(CONTACTS_FILE)
        items.insert(0, doc)
        _save_json(CONTACTS_FILE, items)

    return {"ok": True, "id": inserted_id}


# ---------- Rocky (Gemini) ----------
def build_rocky_system_message() -> str:
    catalog_lines = []
    for p in PRODUCTS:
        line = f"- {p['name']} [{p['category']}]: {p['description']}"
        if p.get("variants"):
            line += f" Options: {', '.join(p['variants'])}."
        catalog_lines.append(line)

    return f"""You are Rocky, the AI packaging assistant for Al Lulu Packaging ({COMPANY['legal_name']}), a packaging materials supplier established in 2013 in {COMPANY['address']}.

STRICT GROUNDING RULES:
- Use ONLY the company facts and product catalogue below. Never invent prices, availability, delivery times, certifications, product specifications not listed here, company history, guarantees or capabilities.
- Never quote prices or lead times. When asked, explain that quotations are prepared by the team and guide the user to the Request a Quote form or WhatsApp.
- If you don't know something, reply with: "I'm not sure about that. Let me connect you with the Al Lulu team." then suggest "WhatsApp Sales" or "Request a Quote".
- Do not claim partnerships or endorsements. Clients listed below are supplied by the company; do not characterise the relationship further.

COMPANY FACTS:
- Name: Al Lulu Packaging (AL LULU PACKING & PACKAGING MAT.CO. LLC)
- Established 2013. Location: {COMPANY['address']}
- Phone: {COMPANY['phone']} | WhatsApp: {COMPANY['phone_intl']} | Email: {COMPANY['email_primary']} / {COMPANY['email_secondary']}
- B2B supplier of packaging materials: corrugated products, boxes, tapes & strapping, protective films. This is a quotation-based B2B supply business, not an online shop.
- Confirmed clients: {', '.join(COMPANY['clients'])}

PRODUCT CATALOGUE:
{chr(10).join(catalog_lines)}

STYLE:
- Short, professional, B2B tone. 2-5 sentences unless the user asks for a list.
- Help users find products by need, explain what each product is for, and ask for product, quantity, size/specification and delivery location when a quotation seems likely, then point them to the Request a Quote form or WhatsApp.
- You may briefly explain what a packaging term means in general terms."""


@api_router.post("/rocky/chat")
async def rocky_chat(body: RockyChat):
    gemini_key = os.environ.get("GEMINI_API_KEY")
    emergent_key = os.environ.get("EMERGENT_LLM_KEY")

    prompt = body.message.strip()[:2000] or "Hello"
    system_instruction = build_rocky_system_message()

    async def event_stream():
        full = ""
        try:
            if gemini_key:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key={gemini_key}"
                payload = {
                    "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                    "systemInstruction": {"parts": [{"text": system_instruction}]},
                    "generationConfig": {"temperature": 0.4, "maxOutputTokens": 800},
                }
                resp = requests.post(url, json=payload, stream=True, timeout=60)
                resp.raise_for_status()
                for line in resp.iter_lines():
                    if not line:
                        continue
                    line_str = line.decode("utf-8") if isinstance(line, bytes) else line
                    if line_str.startswith("data: "):
                        data_json = line_str[6:].strip()
                        if not data_json:
                            continue
                        try:
                            parsed = json.loads(data_json)
                            delta = parsed.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                            if delta:
                                full += delta
                                yield f"data: {json.dumps({'delta': delta})}\n\n"
                        except Exception:
                            pass
            elif emergent_key and LlmChat is not None:
                session_id = f"rocky-{body.session_id[:64]}"
                chat = LlmChat(
                    api_key=emergent_key,
                    session_id=session_id,
                    system_message=system_instruction,
                ).with_model("gemini", "gemini-3-flash-preview")
                async for ev in chat.stream_message(UserMessage(text=prompt)):
                    if isinstance(ev, TextDelta):
                        full += ev.content
                        yield f"data: {json.dumps({'delta': ev.content})}\n\n"
                    elif isinstance(ev, StreamDone):
                        break
            else:
                fallback_msg = (
                    "Hello! I'm Rocky, Al Lulu Packaging's assistant. "
                    "To enable live AI answers, set GEMINI_API_KEY in backend/.env. "
                    "You can also reach our team directly via WhatsApp (+971 6 530 0865) or submit a quote request!"
                )
                full = fallback_msg
                yield f"data: {json.dumps({'delta': fallback_msg})}\n\n"

            yield f"data: {json.dumps({'done': True})}\n\n"
        except Exception as e:
            logger.error(f"Rocky error: {e}")
            full = "I'm not sure about that. Let me connect you with the Al Lulu team."
            yield f"data: {json.dumps({'delta': full})}\n\n"
            yield f"data: {json.dumps({'fallback': True, 'done': True})}\n\n"
        finally:
            try:
                await db.rocky_messages.insert_one({
                    "session_id": body.session_id[:64],
                    "role": "user",
                    "content": prompt,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                })
                await db.rocky_messages.insert_one({
                    "session_id": body.session_id[:64],
                    "role": "assistant",
                    "content": full,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                })
            except Exception as e:
                logging.getLogger(__name__).error(f"Rocky persistence error: {e}")

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


# ---------- admin quote inbox ----------
ADMIN_ATTEMPTS = {}


class AdminLogin(BaseModel):
    model_config = ConfigDict(extra="ignore")
    passcode: str


def admin_auth(request: Request):
    token = request.headers.get("Authorization", "")
    if token.startswith("Bearer "):
        token = token[7:]
    else:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=["HS256"])
        if payload.get("type") != "access" or payload.get("sub") != "admin":
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    return True


@api_router.post("/admin/login")
async def admin_login(request: Request, body: AdminLogin):
    ip = request.client.host if request.client else "unknown"
    now = time.time()
    fails = [t for t in ADMIN_ATTEMPTS.get(ip, []) if now - t < 900]
    if len(fails) >= 5:
        raise HTTPException(status_code=429, detail="Too many attempts. Try again in 15 minutes.")
    expected = os.environ.get("ADMIN_PASSCODE", "")
    if not expected or not hmac.compare_digest(body.passcode, expected):
        fails.append(now)
        ADMIN_ATTEMPTS[ip] = fails
        raise HTTPException(status_code=401, detail="Incorrect passcode")
    ADMIN_ATTEMPTS.pop(ip, None)
    token = jwt.encode(
        {"sub": "admin", "type": "access", "exp": datetime.now(timezone.utc) + timedelta(hours=12)},
        os.environ["JWT_SECRET"], algorithm="HS256",
    )
    return {"token": token}


@api_router.get("/admin/quotations")
async def admin_quotations(_: bool = Depends(admin_auth)):
    try:
        docs = await db.quotes.find().sort("created_at", -1).to_list(500)
        return {"quotations": [from_mongo(d) for d in docs]}
    except Exception as e:
        logger.warning(f"MongoDB unavailable ({e}), loading local quotations")
        docs = _load_json(QUOTES_FILE)
        return {"quotations": [from_mongo(d) for d in docs]}


@api_router.get("/admin/contacts")
async def admin_contacts(_: bool = Depends(admin_auth)):
    try:
        docs = await db.contacts.find().sort("created_at", -1).to_list(500)
        return {"contacts": [from_mongo(d) for d in docs]}
    except Exception as e:
        logger.warning(f"MongoDB unavailable ({e}), loading local contacts")
        docs = _load_json(CONTACTS_FILE)
        return {"contacts": [from_mongo(d) for d in docs]}


@api_router.get("/admin/export")
async def admin_export(type: str = "quotation", _: bool = Depends(admin_auth)):
    if type not in ("quotation", "contact"):
        raise HTTPException(status_code=422, detail="type must be quotation or contact")
    try:
        col = db.quotes if type == "quotation" else db.contacts
        docs = await col.find().sort("created_at", -1).to_list(1000)
    except Exception as e:
        logger.warning(f"MongoDB unavailable ({e}), exporting from local storage")
        target_file = QUOTES_FILE if type == "quotation" else CONTACTS_FILE
        docs = _load_json(target_file)

    buf = io.StringIO()
    if docs:
        fieldnames = list(docs[0].keys())
        writer = csv.DictWriter(buf, fieldnames=fieldnames)
        writer.writeheader()
        for d in docs:
            writer.writerow({k: str(v if v is not None else "") for k, v in d.items()})
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=al-lulu-{type}s.csv"},
    )


@api_router.get("/files/{path:path}")
async def admin_download_file(path: str, _: bool = Depends(admin_auth)):
    # Check for local file upload first
    clean_path = path.replace("local:", "")
    local_file = ROOT_DIR / "uploads" / clean_path.split("/")[-1]
    if local_file.exists():
        with open(local_file, "rb") as f_in:
            content = f_in.read()
        return Response(
            content=content,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={local_file.name}"},
        )

    try:
        key = init_storage()
        resp = requests.get(f"{STORAGE_URL}/objects/{path}", headers={"X-Storage-Key": key}, timeout=60)
        resp.raise_for_status()
        filename = path.split("/")[-1]
        return Response(
            content=resp.content,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )
    except Exception:
        raise HTTPException(status_code=404, detail="File not available")


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    try:
        client.close()
    except Exception:
        pass
