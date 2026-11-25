// ✨ post-check: AI review of a banner + caption before posting (Google Gemini free tier)
import { createClient } from "npm:@supabase/supabase-js@2";
import { encodeBase64 } from "jsr:@std/encoding@1/base64";

const CORS = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS" };
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...CORS, "Content-Type": "application/json" } });
const DAILY_LIMIT = 60;
let MODELS: string[] | null = null;

async function pickModels(key: string): Promise<string[]> {
  if (MODELS) return MODELS;
  const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=" + key);
  const d = await r.json();
  const ok = (d.models || []).filter((m: any) => (m.supportedGenerationMethods || []).includes("generateContent")).map((m: any) => String(m.name).replace("models/", ""))
    .filter((n: string) => /flash/.test(n) && !/(image|tts|audio|live|embed|thinking|exp|8b|robotics|computer)/.test(n));
  const rank = (n: string) => (n === "gemini-flash-latest" ? 0 : n === "gemini-flash-lite-latest" ? 50 : 10) + (/lite/.test(n) ? 20 : 0) + (/preview/.test(n) ? 5 : 0) - (parseFloat((n.match(/gemini-(\d+(\.\d+)?)/) || [])[1] || "0") || 0);
  ok.sort((a: string, b: string) => rank(a) - rank(b));
  MODELS = ok.length ? ok.slice(0, 4) : ["gemini-flash-latest", "gemini-2.5-flash"];
  return MODELS;
}

const RULES = `তুমি "Yaqeen Group"-এর সিনিয়র সোশ্যাল মিডিয়া এডিটর। টিম মেম্বার Facebook-এ পোস্ট দেওয়ার আগে তার ব্যানার (ছবি) আর ক্যাপশন যাচাই করছ। বাংলাদেশের দর্শকের জন্য লেখা।

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
10. ব্যানারের লেখা আর ক্যাপশনে বাংলা/ইংরেজি বানান ভুল খুঁজে বের করো।
11. অভ্যন্তরীণ/গোপন ব্যবসায়িক তথ্য (কমিশন, ভেতরের দাম, ক্লায়েন্টের ব্যক্তিগত তথ্য) থাকলে high issue।
12. Malaysia-র ভিসা/নিয়ম সম্পর্কে স্পষ্ট ভুল তথ্য থাকলে ধরো; নিশ্চিত না হলে "যাচাই করে নিন" বলো — নিজে নতুন তথ্য বানাবে না।

স্কোর ০–১০। verdict: "ok" (৮+ এবং কোনো high issue নেই — পোস্ট করা যাবে), "fix" (ছোটখাটো ঠিক করতে হবে), "redo" (টপিকের সাথে মেলে না বা high issue আছে)।
সব লেখা সহজ বাংলায় (প্রয়োজনে ইংরেজি শব্দ রাখো)। ভদ্র, উৎসাহ দেওয়ার মতো, কিন্তু সৎ।

শুধু এই JSON দাও:
{"score":0,"verdict":"ok|fix|redo","summary":"এক লাইনে মূল কথা","banner_match":true,"caption_match":true,"good":["যা ভালো হয়েছে"],"issues":[{"severity":"high|medium|low","where":"banner|caption","text":"সমস্যা আর কীভাবে ঠিক করবে"}],"spelling":[{"wrong":"ভুল","right":"সঠিক"}],"banner_tips":["ব্যানার উন্নতির পরামর্শ"],"improved_caption":"ঠিক করা ক্যাপশন (ক্যাপশন না দিলে টপিক অনুযায়ী একটা ছোট ক্যাপশন লিখে দাও)"}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  try {
    const KEY = Deno.env.get("GEMINI_API_KEY");
    if (!KEY) return json({ error: "NO_KEY" }, 500);
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

    const parts: any[] = [{ text: RULES + "\n\n---\nটাস্ক: " + title + "\nটপিক: " + topic + "\nক্যাপশন:\n" + (caption || "(ক্যাপশন দেওয়া হয়নি)") + "\nব্যানার: " + (path ? "সাথে দেওয়া ছবি" : "(ব্যানার দেওয়া হয়নি — শুধু ক্যাপশন যাচাই করো, banner_match null)") }];
    if (path) {
      const { data: f, error: fe } = await admin.storage.from("proofs").download(path);
      if (fe || !f) return json({ error: "ব্যানার পাওয়া যায়নি" }, 400);
      parts.push({ inline_data: { mime_type: f.type || "image/jpeg", data: encodeBase64(new Uint8Array(await f.arrayBuffer())) } });
    }
    const models = await pickModels(KEY);
    let out: any = null, used = "", lastErr = "";
    for (const m of models) {
      const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + m + ":generateContent?key=" + KEY, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig: { temperature: 0.2, responseMimeType: "application/json" } }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { lastErr = m + ": " + r.status + " " + ((d.error && d.error.message) || "").slice(0, 160); if (r.status === 429 || r.status >= 500 || r.status === 404) continue; break; }
      const txt = ((d.candidates && d.candidates[0] && d.candidates[0].content && d.candidates[0].content.parts) || []).filter((p: any) => !p.thought).map((p: any) => p.text || "").join("");
      try { out = JSON.parse(txt.replace(/^```(json)?|```$/g, "").trim()); used = m; break; } catch (_) { lastErr = m + ": bad json"; }
    }
    if (!out) return json({ error: "AI এখন ব্যস্ত বা লিমিট শেষ — কিছুক্ষণ পরে আবার চেষ্টা করুন", detail: lastErr }, 503);
    const score = Math.max(0, Math.min(10, Math.round(Number(out.score) || 0)));
    const verdict = ["ok", "fix", "redo"].includes(out.verdict) ? out.verdict : (score >= 8 ? "ok" : score >= 5 ? "fix" : "redo");
    out.score = score; out.verdict = verdict;
    const { data: row } = await admin.from("yg_post_checks").insert({ user_id: user.id, task_id: b.task_id || null, item_id: b.item_id || null, topic, caption, image_path: path, model: used, score, verdict, result: out }).select("id").single();
    return json({ id: row && row.id, model: used, ...out });
  } catch (e) {
    return json({ error: "সার্ভার সমস্যা", detail: String(e).slice(0, 200) }, 500);
  }
});
