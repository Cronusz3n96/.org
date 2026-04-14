import { connect } from 'cloudflare:sockets';

const CONTINUE = 0x03, CONNECT = 0x01, DATA = 0x02, CLOSE = 0x04;
const BUFFER = 128;

function pkt(type, id, payload) {
  const b = new ArrayBuffer(5 + payload.byteLength);
  const v = new DataView(b);
  v.setUint8(0, type);
  v.setUint32(1, id, true);
  new Uint8Array(b).set(payload instanceof Uint8Array ? payload : new Uint8Array(payload.buffer ?? payload), 5);
  return b;
}

function u32le(n) { const b = new ArrayBuffer(4); new DataView(b).setUint32(0, n, true); return new Uint8Array(b); }

export async function onRequest({ request }) {
  if (request.headers.get('Upgrade') !== 'websocket')
    return new Response('Wisp server', { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } });

  const [client, server] = Object.values(new WebSocketPair());
  server.accept();

  const streams = new Map();
  server.send(pkt(CONTINUE, 0, u32le(BUFFER)));

  server.addEventListener('message', async ({ data }) => {
    try {
      const buf = data instanceof ArrayBuffer ? data : await new Response(data).arrayBuffer();
      if (buf.byteLength < 5) return;
      const v = new DataView(buf);
      const type = v.getUint8(0);
      const id = v.getUint32(1, true);
      const payload = buf.slice(5);

      if (type === CONNECT) {
        const dv = new DataView(payload);
        const port = dv.getUint16(0, false);
        const hostname = new TextDecoder().decode(payload.slice(2));
        const tls = port === 443 || port === 8443;
        try {
          const sock = connect({ hostname, port }, { secureTransport: tls ? 'on' : 'off', allowHalfOpen: false });
          const writer = sock.writable.getWriter();
          streams.set(id, writer);
          server.send(pkt(CONTINUE, id, u32le(BUFFER)));
          (async () => {
            const reader = sock.readable.getReader();
            try {
              for (;;) {
                const { done, value } = await reader.read();
                if (done) break;
                try { server.send(pkt(DATA, id, value)); } catch { break; }
              }
            } catch {}
            try { server.send(pkt(CLOSE, id, new Uint8Array([0x02]))); } catch {}
            streams.delete(id);
          })();
        } catch {
          try { server.send(pkt(CLOSE, id, new Uint8Array([0x03]))); } catch {}
        }
      } else if (type === DATA) {
        const w = streams.get(id);
        if (w) try {
          await w.write(new Uint8Array(payload));
          server.send(pkt(CONTINUE, id, u32le(BUFFER)));
        } catch { streams.delete(id); }
      } else if (type === CLOSE) {
        const w = streams.get(id);
        if (w) { try { w.close(); } catch {} streams.delete(id); }
      }
    } catch {}
  });

  server.addEventListener('close', () => {
    for (const w of streams.values()) try { w.close(); } catch {}
    streams.clear();
  });

  return new Response(null, { status: 101, webSocket: client });
}
