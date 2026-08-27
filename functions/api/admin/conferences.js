// GET  /api/admin/conferences?token=...              -> list all (same data as public, admin-authenticated)
// POST /api/admin/conferences?token=...  {..fields..}  -> create a new conference entry

export async function onRequestGet(context) {
  const { request, env } = context;
  if (!authorized(request, env)) return unauthorized();

  const { results } = await env.DB.prepare(
    "SELECT * FROM conferences ORDER BY sort_order DESC, id DESC"
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

  const { edition, title, start_date, end_date, venue, description, image_url, sort_order } = body;
  if (!edition || !title) {
    return json({ error: "Edition and title are required." }, 400);
  }

  const result = await env.DB.prepare(
    `INSERT INTO conferences (edition, title, start_date, end_date, venue, description, image_url, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      edition,
      title,
      start_date || null,
      end_date || null,
      venue || null,
      description || null,
      image_url || null,
      Number.isFinite(sort_order) ? sort_order : 0
    )
    .run();

  return json({ ok: true, id: result.meta.last_row_id }, 201);
}

export function authorized(request, env) {
  if (!env.ADMIN_TOKEN) return false;
  const token = new URL(request.url).searchParams.get("token");
  return token && token === env.ADMIN_TOKEN;
}

export function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

export function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
