document.getElementById('goBtn').addEventListener('click', () => {
  let url = document.getElementById('urlInput').value
  if (!url) return alert("Enter a URL!")

  if (!/^https?:\/\//i.test(url)) {
    url = 'https://' + url
  }

  window.open(`/api/proxy?url=${encodeURIComponent(url)}`, '_blank')
})
