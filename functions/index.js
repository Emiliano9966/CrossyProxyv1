addEventListener('fetch', event => {
  const url = new URL(event.request.url)

  // Only handle requests with ?url=
  if (url.searchParams.has('url')) {
    event.respondWith(handleProxy(event.request))
  }
  // Otherwise, Workers Sites will serve static files automatically
})

async function handleProxy(request) {
  const url = new URL(request.url)
  let target = url.searchParams.get('url')

  if (!target) {
    return new Response('Missing ?url= parameter', { status: 400 })
  }

  // Ensure URL has https:// if missing
  if (!/^https?:\/\//i.test(target)) {
    target = 'https://' + target
  }

  try {
    const response = await fetch(target)
    const newHeaders = new Headers(response.headers)
    newHeaders.set('Access-Control-Allow-Origin', '*')
    newHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    newHeaders.set('Access-Control-Allow-Headers', '*')

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    })
  } catch (err) {
    return new Response('Error fetching URL: ' + err.message, { status: 500 })
  }
}
