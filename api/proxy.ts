export const config = {
  runtime: 'edge',
}

const UPSTREAM = 'https://vortex.worldofwarships.eu/api'

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const path = url.searchParams.get('path') ?? ''

  const upstreamQuery = new URLSearchParams(url.searchParams)
  upstreamQuery.delete('path')
  const query = upstreamQuery.toString()
  const upstreamUrl = `${UPSTREAM}/${path}${query ? `?${query}` : ''}`

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        Accept: 'application/json',
      },
    })

    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch {
    return Response.json({ error: 'Upstream request failed' }, { status: 502 })
  }
}
