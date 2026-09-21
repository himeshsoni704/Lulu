import { useEffect, useState } from "react";
import { Download, FileText, Loader2, Lock, LogOut } from "lucide-react";
import { toast } from "sonner";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TOKEN_KEY = "allulu-admin-token";

const formatApiErrorDetail = (detail) => {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  return String(detail);
};

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleString("en-AE", { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return iso || "—";
  }
};

const TH = ({ children }) => (
  <th className="border-b border-line px-3 py-3 text-left font-mono text-[9px] font-medium uppercase tracking-[0.14em] text-slate-500 whitespace-nowrap">{children}</th>
);
const TD = ({ children, wide }) => (
  <td className={`border-b border-line px-3 py-3 align-top text-sm ${wide ? "max-w-[240px] whitespace-normal" : "whitespace-nowrap"}`}>{children}</td>
);

function Login({ onLogin }) {
  const [passcode, setPasscode] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || "Login failed");
      onLogin(data.token);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.message));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-[70vh] place-items-center px-5" data-testid="admin-login-view">
      <form onSubmit={submit} className="w-full max-w-sm border border-line bg-white p-8 shadow-sm" data-testid="admin-login-form">
        <span className="grid h-11 w-11 place-items-center rounded-sm bg-charcoal text-bone"><Lock className="h-5 w-5" /></span>
        <h1 className="mt-5 font-display text-2xl font-extrabold uppercase tracking-tight">Quote Inbox</h1>
        <p className="mt-1.5 text-sm text-slate-600">Team access only. Enter the admin passcode to view incoming quotation requests.</p>
        <label className="field-label mt-6" htmlFor="admin-passcode">Admin Passcode</label>
        <input
          id="admin-passcode"
          type="password"
          required
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="field"
          placeholder="••••••••"
          autoComplete="current-password"
          data-testid="admin-passcode-input"
        />
        <button type="submit" disabled={busy} data-testid="admin-login-button"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-kraft px-6 py-3.5 font-mono text-[11px] uppercase tracking-[0.18em] text-bone transition-colors hover:bg-kraft-dark disabled:opacity-60">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [tab, setTab] = useState("quotation");
  const [rows, setRows] = useState({ quotation: [], contact: [] });
  const [loading, setLoading] = useState(false);

  const load = async (t) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${t}` };
      const [q, c] = await Promise.all([
        fetch(`${API}/admin/quotations`, { headers }),
        fetch(`${API}/admin/contacts`, { headers }),
      ]);
      if (q.status === 401 || c.status === 401) {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        toast.error("Session expired. Please sign in again.");
        return;
      }
      if (!q.ok || !c.ok) throw new Error("Could not load requests");
      setRows({ quotation: (await q.json()).quotations || [], contact: (await c.json()).contacts || [] });
    } catch (err) {
      toast.error(formatApiErrorDetail(err.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) load(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onLogin = (t) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    load(t);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
  };

  const exportCsv = async () => {
    try {
      const res = await fetch(`${API}/admin/export?type=${tab}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `al-lulu-${tab}s.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.message));
    }
  };

  const downloadFile = async (r) => {
    try {
      const res = await fetch(`${API}/files/${r.file_path}`, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error("Download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = r.file_name || "attachment";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(formatApiErrorDetail(err.message));
    }
  };

  if (!token) return <Login onLogin={onLogin} />;

  const list = rows[tab];
  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-12" data-testid="admin-inbox-view">
      <div className="flex flex-col justify-between gap-5 border-b border-line pb-6 lg:flex-row lg:items-end">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-kraft">Team area</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">Quote Inbox</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={exportCsv} data-testid="admin-export-button"
            className="inline-flex items-center gap-2 border border-charcoal/20 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors hover:bg-charcoal hover:text-bone">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </button>
          <button onClick={logout} data-testid="admin-logout-button"
            className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-slate-500 transition-colors hover:text-charcoal">
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        {[["quotation", "Quotations"], ["contact", "Messages"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} data-testid={`admin-tab-${key}`}
            className={`border px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors ${
              tab === key ? "border-charcoal bg-charcoal text-bone" : "border-line bg-white text-charcoal/70 hover:border-charcoal/40"
            }`}>
            {label} ({rows[key].length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid place-items-center py-20 text-slate-400" data-testid="admin-loading"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : list.length === 0 ? (
        <div className="py-20 text-center" data-testid="admin-empty">
          <p className="font-display text-xl font-bold uppercase">Nothing here yet</p>
          <p className="mt-2 text-sm text-slate-500">New submissions will appear here the moment a customer sends them.</p>
        </div>
      ) : tab === "quotation" ? (
        <div className="mt-6 overflow-x-auto border border-line bg-white" data-testid="admin-quotations-table">
          <table className="w-full min-w-[1100px] border-collapse">
            <thead>
              <tr>
                <TH>Received</TH><TH>Name</TH><TH>Company</TH><TH>Phone</TH><TH>Email</TH><TH>Product</TH><TH>Qty</TH><TH>Size / Spec</TH><TH>Delivery</TH><TH>Needed By</TH><TH>Notes</TH><TH>File</TH>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className="hover:bg-paper/60">
                  <TD>{fmtDate(r.created_at)}</TD>
                  <TD><span className="font-semibold">{r.name}</span></TD>
                  <TD>{r.company}</TD>
                  <TD>{r.phone || "—"}</TD>
                  <TD>{r.email}</TD>
                  <TD>{r.product || "—"}</TD>
                  <TD>{r.quantity || "—"}</TD>
                  <TD>{r.size_spec || "—"}</TD>
                  <TD>{r.delivery_location || "—"}</TD>
                  <TD>{r.required_date || "—"}</TD>
                  <TD wide>{r.notes || "—"}</TD>
                  <TD>{r.file_name ? (
                    <button onClick={() => downloadFile(r)} data-testid={`admin-file-${r.id}`} className="inline-flex items-center gap-1.5 text-kraft underline underline-offset-4">
                      <FileText className="h-3.5 w-3.5" />{r.file_name}
                    </button>
                  ) : "—"}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto border border-line bg-white" data-testid="admin-messages-table">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr><TH>Received</TH><TH>Name</TH><TH>Email</TH><TH>Phone</TH><TH>Message</TH></tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className="hover:bg-paper/60">
                  <TD>{fmtDate(r.created_at)}</TD>
                  <TD><span className="font-semibold">{r.name}</span></TD>
                  <TD>{r.email}</TD>
                  <TD>{r.phone || "—"}</TD>
                  <TD wide>{r.message}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
