// GET /api/manuscripts/:id/download -> stream an approved manuscript's file

export async function onRequestGet(context) {
  const { env, params } = context;

  const row = await env.DB.prepare(
    "SELECT file_key, file_name, status FROM manuscripts WHERE id = ?"
  )
    .bind(params.id)
    .first();

  if (!row || row.status !== "approved") {
    return new Response("Not found", { status: 404 });
  }

  const object = await env.MANUSCRIPTS.get(row.file_key);
  if (!object) {
    return new Response("Not found", { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      "Content-Type": object.httpMetadata?.contentType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${row.file_name}"`,
      "Cache-Control": "private, max-age=0",
    },
  });
}
