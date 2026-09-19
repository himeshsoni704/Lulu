from fastapi import FastAPI, APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, BeforeValidator
from typing import Annotated, List, Optional
from emergentintegrations.llm.chat import LlmChat, UserMessage, TextDelta, StreamDone
import os
import logging
import uuid
import json
import re
from pathlib import Path
from datetime import datetime, timezone

from data import COMPANY, CATEGORIES, PRODUCTS, PRODUCT_INDEX

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

UPLOAD_DIR = ROOT_DIR / 'uploads'
UPLOAD_DIR.mkdir(exist_ok=True)

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
        safe = re.sub(r"[^A-Za-z0-9._-]", "_", file.filename)[:80]
        stored = f"{uuid.uuid4().hex[:12]}_{safe}"
        path = UPLOAD_DIR / stored
        with open(path, "wb") as f:
            f.write(await file.read())
        doc["file_name"] = safe

    result = await db.quotes.insert_one(doc)
    return {"ok": True, "id": str(result.inserted_id)}


@api_router.post("/contact")
async def create_contact(input: ContactCreate):
    if not input.name.strip() or not input.message.strip():
        raise HTTPException(status_code=422, detail="Name and message are required")
    if not re.match(r"[^@\s]+@[^@\s]+\.[^@\s]+", input.email or ""):
        raise HTTPException(status_code=422, detail="A valid email is required")
    doc = input.model_dump()
    doc.update({"name": input.name.strip(), "created_at": datetime.now(timezone.utc).isoformat()})
    result = await db.contacts.insert_one(doc)
    return {"ok": True, "id": str(result.inserted_id)}


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
    api_key = os.environ.get('EMERGENT_LLM_KEY')
    if not api_key:
        raise HTTPException(status_code=500, detail="LLM key not configured")

    prompt = body.message.strip()[:2000] or "Hello"
    session_id = f"rocky-{body.session_id[:64]}"

    chat = LlmChat(
        api_key=api_key,
        session_id=session_id,
        system_message=build_rocky_system_message(),
    ).with_model("gemini", "gemini-3-flash-preview")

    async def event_stream():
        full = ""
        try:
            async for ev in chat.stream_message(UserMessage(text=prompt)):
                if isinstance(ev, TextDelta):
                    full += ev.content
                    yield f"data: {json.dumps({'delta': ev.content})}\n\n"
                elif isinstance(ev, StreamDone):
                    break
            yield f"data: {json.dumps({'done': True})}\n\n"
        except Exception as e:
            logging.getLogger(__name__).error(f"Rocky error: {e}")
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


app.include_router(api_router)
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
