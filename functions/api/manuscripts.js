// GET  /api/manuscripts        -> list publicly approved manuscripts
// POST /api/manuscripts        -> submit a new manuscript for review

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare(
    `SELECT id, title, authors, conference, file_name, submitted_at
     FROM manuscripts WHERE status = 'approved' ORDER BY submitted_at DESC`
  ).all();
  return Response.json(results);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Invalid form submission." }, 400);
  }

  // Honeypot: a hidden field real users never fill in. If it's set, silently
  // pretend success so bots don't learn to avoid it.
  if ((form.get("website") || "").toString().trim()) {
    return json({ ok: true, message: "Manuscript submitted for review." }, 201);
  }

  const title = (form.get("title") || "").toString().trim();
  const authors = (form.get("authors") || "").toString().trim();
  const email = (form.get("email") || "").toString().trim();
  const conference = (form.get("conference") || "").toString().trim();
  const abstract = (form.get("abstract") || "").toString().trim();
  const file = form.get("file");

  if (!title || !authors || !email || !(file instanceof File)) {
    return json({ error: "Title, authors, email and a file are all required." }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "Please provide a valid email address." }, 400);
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return json({ error: "Only PDF or Word documents (.pdf, .doc, .docx) are accepted." }, 400);
  }
  if (file.size > MAX_SIZE) {
    return json({ error: "File is too large — the limit is 20MB." }, 400);
  }

  const key = `manuscripts/${Date.now()}-${crypto.randomUUID()}-${sanitizeFilename(file.name)}`;
  await env.MANUSCRIPTS.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });

  await env.DB.prepare(
    `INSERT INTO manuscripts (title, authors, email, conference, abstract, file_key, file_name, status, submitted_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', datetime('now'))`
  )
    .bind(title, authors, email, conference, abstract, key, file.name)
    .run();

  return json({ ok: true, message: "Thanks — your manuscript was submitted and is pending review." }, 201);
}

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-120);
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
