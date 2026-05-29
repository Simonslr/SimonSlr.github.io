export const dynamic = "force-dynamic"

// Identical PATCH to public/sw.js — kept in sync manually.
const PATCH =
  "<script>try{" +
  "var _ib=Node.prototype.insertBefore;" +
  "Node.prototype.insertBefore=function(n,r){try{return _ib.call(this,n,r)}catch(e){if(e&&(e.name==='NotFoundError'||e.name==='HierarchyRequestError'))return n;throw e}};" +
  "var _rc=Node.prototype.removeChild;" +
  "Node.prototype.removeChild=function(n){try{return _rc.call(this,n)}catch(e){if(e&&(e.name==='NotFoundError'||e.name==='HierarchyRequestError'))return n;throw e}};" +
  "var _rp=Node.prototype.replaceChild;" +
  "Node.prototype.replaceChild=function(n,o){try{return _rp.call(this,n,o)}catch(e){if(e&&(e.name==='NotFoundError'||e.name==='HierarchyRequestError'))return o;throw e}};" +
  "var _onerr=window.onerror;" +
  "window.onerror=function(m,s,l,c,e){if(m&&(m.includes('insertBefore')||m.includes('removeChild')||m.includes('NotFoundError')||m.includes('HierarchyRequestError')))return true;return _onerr?_onerr(m,s,l,c,e):false};" +
  "}catch(e){}<" + "/script>"

const SW_SCRIPT = `// Service Worker — injects DOM patch before async Next.js bundles.
// Activates on the second page load (when scripts are cached and the race
// condition occurs). First load is unaffected and already works fine.
// Served from /api/sw because Vercel routes public/*.js through Next.js.

const PATCH = ${JSON.stringify(PATCH)};

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return;
  event.respondWith(transformNavigation(event.request));
});

async function transformNavigation(request) {
  let response;
  try {
    response = await fetch(request);
  } catch {
    return Response.error();
  }

  const ct = response.headers.get('content-type') || '';
  if (!ct.includes('text/html') || !response.body) return response;

  let injected = false;
  const enc = new TextEncoder();
  const dec = new TextDecoder('utf-8', { ignoreBOM: true });

  // Accumulate chunks until we find <head>, then inject and flush.
  let buf = '';
  const transform = new TransformStream({
    transform(chunk, controller) {
      if (injected) {
        controller.enqueue(chunk);
        return;
      }
      buf += dec.decode(chunk, { stream: true });
      const idx = buf.indexOf('<head>');
      if (idx !== -1) {
        const modified = buf.slice(0, idx + 6) + PATCH + buf.slice(idx + 6);
        controller.enqueue(enc.encode(modified));
        buf = '';
        injected = true;
      }
      // else: keep buffering (head tag split across chunks — very rare)
    },
    flush(controller) {
      // Drain any remaining buffered text (head never found, or tail bytes).
      const remaining = buf + dec.decode();
      if (remaining) controller.enqueue(enc.encode(remaining));
    },
  });

  const headers = new Headers(response.headers);
  headers.delete('content-length');

  return new Response(response.body.pipeThrough(transform), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
`

export async function GET() {
  return new Response(SW_SCRIPT, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Service-Worker-Allowed": "/",
    },
  })
}
