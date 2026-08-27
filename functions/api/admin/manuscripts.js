// GET  /api/admin/manuscripts?token=...            -> list every submission
// POST /api/admin/manuscripts?token=...  {id,status} -> approve/reject/reset one
//
// Protected by a shared secret (the ADMIN_TOKEN environment variable set in
// the Cloudflare Pages project settings) rather than full user accounts —
// deliberately lightweight since this is a single-secretariat moderation tool.

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!authorized(request, env)) return unauthorized();

  const { results } = await env.DB.prepare(
    "SELECT id, title, authors, email, conference, abstract, file_name, status, submitted_at FROM manuscripts ORDER BY submitted_at DESC"
  ).all();
  return Response.json(results);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (!authorized(request, env)) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const { id, status } = body;
  if (!id || !["approved", "rejected", "pending"].includes(status)) {
    return json({ error: "Provide id and a valid status." }, 400);
  }

  await env.DB.prepare("UPDATE manuscripts SET status = ? WHERE id = ?").bind(status, id).run();
  return json({ ok: true });
}

function authorized(request, env) {
  if (!env.ADMIN_TOKEN) return false;
  const token = new URL(request.url).searchParams.get("token");
  return token && token === env.ADMIN_TOKEN;
}

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
