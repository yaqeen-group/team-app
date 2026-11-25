// ✨ post-check: AI review of a banner + caption before posting (Groq free → Mistral free → Gemini)
import { createClient } from "npm:@supabase/supabase-js@2";
import { encodeBase64 } from "jsr:@std/encoding@1/base64";

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const DAILY_LIMIT = 60;
let GROQ_MODELS: string[] | null = null; let GROQ_ALL = "";
async function groqModels(key: string): Promise<string[]> {
  if (GROQ_MODELS) return GROQ_MODELS;
  try {
    const r = await fetch("https://api.groq.com/openai/v1/models", { headers: { Authorization: "Bearer " + key } });
    const d = await r.json();
    GROQ_ALL = (d.data || []).map((m: any) => String(m.id)).join(","); const ids = (d.data || []).map((m: any) => String(m.id)).filter((n: string) => /scout|maverick|vision|qwen|-vl|llava|gemma/i.test(n) && !/guard|whisper|orpheus/i.test(n));
    ids.sort((a: string, b: string) => (/scout|vl|vision/.test(a) ? 0 : 1) - (/scout|vl|vision/.test(b) ? 0 : 1));
    GROQ_MODELS = ids.length ? ids.slice(0, 3) : ["meta-llama/llama-4-scout-17b-16e-instruct"];
  } catch (_) { GROQ_MODELS = ["meta-llama/llama-4-scout-17b-16e-instruct"]; }
  return GROQ_MODELS;
}
type Att = { model: string; ok: boolean; status: number; text: string; err: string };
async function openaiStyle(url: string, key: string, model: string, prompt: string, img: string | null, jsonMode = true): Promise<Att> {
  const content: any[] = [{ type: "text", text: prompt }];
  if (img) content.push({ type: "image_url", image_url: { url: img } });
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
    body: JSON.stringify({ model, temperature: 0.2, max_tokens: 2048, ...(jsonMode ? { response_format: { type: "json_object" } } : {}), messages: [{ role: "user", content }] }) });
  const d = await r.json().catch(() => ({}));
  return { model, ok: r.ok, status: r.status, text: (d.choices && d.choices[0] && d.choices[0].message && d.choices[0].message.content) || "", err: ((d.error && (d.error.message || d.error)) || "").toString().slice(0, 160) };
}
async function gemini(key: string, prompt: string, mime: string, b64: string | null): Promise<Att> {
  const parts: any[] = [{ text: prompt }]; if (b64) parts.push({ inline_data: { mime_type: mime, data: b64 } });
  const model = "gemini-flash-latest";
  const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + key, { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig: { temperature: 0.2, responseMimeType: "application/json" } }) });
  const d = await r.json().catch(() => ({}));
  const text = ((d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts) || []).filter((p: any) => !p.thought).map((p: any) => p.text || "").join("");
  return { model, ok: r.ok, status: r.status, text, err: ((d.error && d.error.message) || "").slice(0, 160) };
}

const RULES = `তুমি "Yaqeen Group"-এর সিনিয়র সোশ্যাল মিডিয়া এডিটর। টিম মেম্বার Facebook-এ পোস্ট দেওয়ার আগে তার ব্যানার (ছবি) আর ক্যাপশন যাচাই করছ। বাংলাদেশের দর্শকের জন্য লেখা। পোস্টার/ক্যাপশন বাংলায়, ইংরেজিতে বা দুটো মিলিয়ে হতে পারে — যে ভাষাতেই হোক, সমান যত্নে যাচাই করবে।

কোম্পানির তথ্য:
- MY TRAVELMATE: Malaysia-তে উচ্চশিক্ষা (student consultancy) + সব ভিসার কাজ (Malaysia tourist/student visa)।
- Halal Safaar: এয়ার টিকিট, ট্যুর প্যাকেজ, হালাল ট্রাভেল, হোটেল।
- পাকুল্লা ব্রাঞ্চ: টাঙ্গাইলের পাকুল্লা বাজারের লোকাল দোকান (প্রিন্ট, ফটোকপি, অনলাইন আবেদন, টিকিট, কাউন্সেলিং)।
- "হেল্প পোস্ট" (ওয়েবসাইট/Yaqeen Hisab/অ্যাপ বিষয়ে তথ্য): কোনো কোম্পানির নাম/লোগো/ব্র্যান্ডিং থাকবে না।

নিয়ম (ভাঙলে issue দাও):
1. ব্যানার ও ক্যাপশন — দুটোই টপিকের সাথে মিলতে হবে।
2. ভিসার পোস্ট শুধু Malaysia নিয়ে। টিকিটের পোস্ট শুধু এয়ার টিকিট — বাস টিকিট না।
3. "ভিসা গ্যারান্টি", "১০০% ভিসা", "নিশ্চিত ভিসা" — এমন দাবি একদম নিষেধ (high)।
4. বানানো দাম/পরিসংখ্যান/অফার নিষেধ। দাম বা ভাড়া থাকলে মনে করিয়ে দাও যেন আসল পোর্টাল থেকে মিলিয়ে নেয় (medium)।
5. ছবিতে কোনো নারী/মেয়ের ছবি থাকবে না (high)।
6. এক ব্র্যান্ডের পোস্টে অন্য ব্র্যান্ডের লোগো/নাম থাকবে না (MY TRAVELMATE আর Halal Safaar মেশানো যাবে না) (high)।
7. গ্রুপের তথ্যভিত্তিক পোস্ট বিক্রির বিজ্ঞাপনের মতো হবে না — মানুষকে দরকারি তথ্য দেবে। শেষে "প্রশ্ন থাকলে কমেন্টে জানান" ধরনের লাইন থাকলে ভালো।
8. ক্যাপশন ছোট ও সহজ (মোটামুটি ৪০–১২০ শব্দ), প্রথম লাইনে আকর্ষণীয় hook, ভুল তথ্য নেই।
9. ব্যানারে বড় করে একটা আকর্ষণীয় hook লাইন + ব্র্যান্ড; লেখা পড়া যায়; ছবি টপিকের সাথে সম্পর্কিত; অতিরিক্ত লেখা ঠাসা না।
10. ব্যানারের লেখা আর ক্যাপশনে বানান ও ব্যাকরণ ভুল খুঁজে বের করো — বাংলা হলে বাংলা বানান, English হলে English spelling, grammar ও punctuation; দুই ভাষা মেশানো থাকলে দুটোই।
11. অভ্যন্তরীণ/গোপন ব্যবসায়িক তথ্য (কমিশন, ভেতরের দাম, ক্লায়েন্টের ব্যক্তিগত তথ্য) থাকলে high issue।
12. Malaysia-র ভিসা/নিয়ম সম্পর্কে স্পষ্ট ভুল তথ্য থাকলে ধরো; নিশ্চিত না হলে "যাচাই করে নিন" বলো — নিজে নতুন তথ্য বানাবে না।

স্কোর ০–১০। verdict: "ok" (৮+ এবং কোনো high issue নেই — পোস্ট করা যাবে), "fix" (ছোটখাটো ঠিক করতে হবে), "redo" (টপিকের সাথে মেলে না বা high issue আছে)।
ফিডব্যাক (summary, issues, tips, good) সহজ বাংলায় লেখো (প্রয়োজনে ইংরেজি শব্দ রাখো)। কিন্তু improved_caption আর spelling-এর \"right\" অবশ্যই মূল লেখার ভাষাতেই হবে — English ক্যাপশন হলে ঠিক করা ক্যাপশনও English-এ। ভদ্র, উৎসাহ দেওয়ার মতো, কিন্তু সৎ।

শুধু এই JSON দাও:
{"score":0,"verdict":"ok|fix|redo","summary":"এক লাইনে মূল কথা","banner_match":true,"caption_match":true,"good":["যা ভালো হয়েছে"],"issues":[{"severity":"high|medium|low","where":"banner|caption","text":"সমস্যা আর কীভাবে ঠিক করবে"}],"spelling":[{"wrong":"ভুল","right":"সঠিক"}],"banner_tips":["ব্যানার উন্নতির পরামর্শ"],"improved_caption":"ঠিক করা ক্যাপশন (ক্যাপশন না দিলে টপিক অনুযায়ী একটা ছোট ক্যাপশন লিখে দাও)"}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const GROQ = Deno.env.get("GROQ_API_KEY"), MISTRAL = Deno.env.get("MISTRAL_API_KEY"), GEM = Deno.env.get("GEMINI_API_KEY");
    if (!GROQ && !MISTRAL && !GEM) return json({ error: "NO_KEY" }, 500);
    let SK = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    if (!SK) { try { const k = JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") || "{}"); SK = k.default || Object.values(k)[0] as string || ""; } catch (_) {} }
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, SK, { auth: { persistSession: false } });
    const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    const { data: u } = await admin.auth.getUser(jwt);
    const user = u && u.user; if (!user) return json({ error: "AUTH" }, 401);
    const b = await req.json();
    const topic = String(b.topic || "").slice(0, 400), caption = String(b.caption || "").slice(0, 4000), title = String(b.title || "").slice(0, 300);
    const path = b.image_path ? String(b.image_path) : null;
    if (!topic) return json({ error: "টপিক দরকার" }, 400);
    if (!path && caption.length < 10) return json({ error: "ব্যানার অথবা ক্যাপশন দিন" }, 400);
    if (path && !path.startsWith(user.id + "/")) return json({ error: "ভুল ফাইল" }, 403);
    const since = new Date(Date.now() - 864e5).toISOString();
    const { count } = await admin.from("yg_post_checks").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", since);
    if ((count || 0) >= DAILY_LIMIT) return json({ error: "আজকের চেক লিমিট শেষ (" + DAILY_LIMIT + "টা)। কাল আবার চেষ্টা করুন।" }, 429);

    const prompt = RULES + "\n\n---\nটাস্ক: " + title + "\nটপিক: " + topic + "\nক্যাপশন:\n" + (caption || "(ক্যাপশন দেওয়া হয়নি)") + "\nব্যানার: " + (path ? "সাথে দেওয়া ছবি" : "(ব্যানার দেওয়া হয়নি — শুধু ক্যাপশন যাচাই করো, banner_match null)");
    let mime = "image/jpeg", b64: string | null = null;
    if (path) {
      const { data: f, error: fe } = await admin.storage.from("proofs").download(path);
      if (fe || !f) return json({ error: "ব্যানার পাওয়া যায়নি" }, 400);
      mime = f.type || "image/jpeg"; b64 = encodeBase64(new Uint8Array(await f.arrayBuffer()));
    }
    const img = b64 ? "data:" + mime + ";base64," + b64 : null;
    const tries: (() => Promise<Att>)[] = [];
    if (GROQ) for (const m of await groqModels(GROQ)) tries.push(() => openaiStyle("https://api.groq.com/openai/v1/chat/completions", GROQ!, m, prompt, img, false));
    if (GROQ) tries.push(async () => { const a = await openaiStyle("https://api.groq.com/openai/v1/chat/completions", GROQ!, "openai/gpt-oss-120b", prompt + (img ? "\n\n(নোট: ব্যানারের ছবি এই মডেল দেখতে পারছে না — শুধু ক্যাপশন যাচাই করো, banner_match null দাও, আর summary-তে লেখো যে ব্যানার আলাদা করে দেখে নিতে হবে)" : ""), null, true); a.model += img ? " (text-only)" : ""; return a; });
    if (MISTRAL) for (const m of ["mistral-medium-latest", "mistral-small-latest"]) tries.push(() => openaiStyle("https://api.mistral.ai/v1/chat/completions", MISTRAL!, m, prompt, img));
    if (GEM) tries.push(() => gemini(GEM!, prompt, mime, b64));
    let out: any = null, used = "", lastErr = "";
    for (const t of tries) {
      let a: Att; try { a = await t(); } catch (e) { lastErr += " | " + String(e).slice(0, 120); continue; }
      if (!a.ok) { lastErr += " | " + a.model + ": " + a.status + " " + a.err; continue; }
      try { const tx = a.text.trim().replace(/^```(json)?/, "").replace(/```$/, "").trim(); out = JSON.parse(tx.slice(tx.indexOf("{"), tx.lastIndexOf("}") + 1)); used = a.model; break; } catch (_) { lastErr += " | " + a.model + ": bad json " + a.text.slice(0, 80); }
    }
    if (!out) return json({ error: "AI এখন ব্যস্ত বা লিমিট শেষ — কিছুক্ষণ পরে আবার চেষ্টা করুন", detail: lastErr.slice(0, 900), groq_models: GROQ_ALL, providers: { groq: !!GROQ, mistral: !!MISTRAL, gemini: !!GEM } }, 503);
    const score = Math.max(0, Math.min(10, Math.round(Number(out.score) || 0)));
    const verdict = ["ok", "fix", "redo"].includes(out.verdict) ? out.verdict : (score >= 8 ? "ok" : score >= 5 ? "fix" : "redo");
    out.score = score; out.verdict = verdict;
    const { data: row } = await admin.from("yg_post_checks").insert({ user_id: user.id, task_id: b.task_id || null, item_id: b.item_id || null, topic, caption, image_path: path, model: used, score, verdict, result: out }).select("id").single();
    return json({ id: row && row.id, model: used, ...out });
  } catch (e) {
    return json({ error: "সার্ভার সমস্যা", detail: String(e).slice(0, 200) }, 500);
  }
});
