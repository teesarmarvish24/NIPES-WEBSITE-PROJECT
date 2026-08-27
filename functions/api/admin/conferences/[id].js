// PATCH  /api/admin/conferences/:id?token=...  -> update a conference entry
// DELETE /api/admin/conferences/:id?token=...  -> delete a conference entry

import { authorized, unauthorized, json } from "../conferences.js";

export async function onRequestPatch(context) {
  const { request, env, params } = context;
  if (!authorized(request, env)) return unauthorized();

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const fields = ["edition", "title", "start_date", "end_date", "venue", "description", "image_url", "sort_order"];
  const updates = [];
  const values = [];
  for (const f of fields) {
    if (f in body) {
      updates.push(`${f} = ?`);
      values.push(body[f]);
    }
  }
  if (!updates.length) return json({ error: "No fields to update." }, 400);

  values.push(params.id);
  await env.DB.prepare(`UPDATE conferences SET ${updates.join(", ")} WHERE id = ?`)
    .bind(...values)
    .run();

  return json({ ok: true });
}

export async function onRequestDelete(context) {
  const { request, env, params } = context;
  if (!authorized(request, env)) return unauthorized();

  await env.DB.prepare("DELETE FROM conferences WHERE id = ?").bind(params.id).run();
  return json({ ok: true });
}
