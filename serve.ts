const dist = `${import.meta.dir}/dist`

Bun.serve({
  port: 4173,
  async fetch(req) {
    const url = new URL(req.url)
    let path = url.pathname === '/' ? '/index.html' : url.pathname
    const file = Bun.file(`${dist}${path}`)
    if (await file.exists()) {
      return new Response(file)
    }
    return new Response('Not found', { status: 404 })
  },
})

console.log('Preview en http://localhost:4173')
