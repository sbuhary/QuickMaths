const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
};

function resolveRequest(url) {
  const parsed = new URL(url, `http://127.0.0.1:${port}`);
  const requested = parsed.pathname === "/" ? "/index.html" : parsed.pathname;
  const filePath = path.normalize(path.join(root, decodeURIComponent(requested)));
  if (!filePath.startsWith(root)) return null;
  return filePath;
}

const server = http.createServer((request, response) => {
  const filePath = resolveRequest(request.url || "/");
  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  fs.readFile(filePath, (error, body) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }
    response.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
    });
    response.end(body);
  });
});

server.listen(port, "127.0.0.1", () => {
  console.log(`QuickMaths test server listening on http://127.0.0.1:${port}`);
});
