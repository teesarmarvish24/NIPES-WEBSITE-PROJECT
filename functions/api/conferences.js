// GET /api/conferences -> public list of all conferences, newest first

export async function onRequestGet(context) {
  const { env } = context;
  const { results } = await env.DB.prepare(
    "SELECT * FROM conferences ORDER BY sort_order DESC, id DESC"
  ).all();
  return Response.json(results);
}
