export const config = {
  runtime: 'edge',
}

export default async function handler(): Promise<Response> {
  return Response.json({
    ok: true,
    source: 'wow-explorer-edge',
  })
}
