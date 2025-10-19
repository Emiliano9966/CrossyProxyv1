export default async function handler(req, res) {
  const urlParam = req.query.url || req.body?.url
  if (!urlParam) {
    res.status(400).send('Missing ?url= parameter')
    return
  }

  let target = urlParam
  if (!/^https?:\/\//i.test(target)) {
    target = 'https://' + target
  }

  try {
    const response = await fetch(target)
    const body = await response.text()

    // Copy headers except some restricted ones
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', '*')

    res.status(response.status).send(body)
  } catch (err) {
    res.status(500).send('Error fetching URL: ' + err.message)
  }
}
