import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('../', import.meta.url)));
const port = Number(process.env.PORT || 8793);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.svg': 'image/svg+xml' };
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let path = resolve(root, `.${pathname}`);
    if (path !== root && !path.startsWith(root.endsWith(sep) ? root : root + sep)) throw new Error('Invalid path');
    if (pathname.split('/').some(part => part.startsWith('.') && part !== '.')) throw new Error('Hidden path');
    if ((await stat(path)).isDirectory()) path = resolve(path, 'index.html');
    const content = await readFile(path);
    res.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(content);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`S3 Gallery: http://127.0.0.1:${port}`));
