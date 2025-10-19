document.getElementById('goBtn').addEventListener('click', () => {
  let url = document.getElementById('urlInput').value
  if (!url) return alert("Enter a URL!")

  // Add https:// if missing
  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url
  }

  window.open(`https://crossyproxy.emilianocabralcerroni.workers.dev?url=${encodeURIComponent(url)}`, '_blank')
})
