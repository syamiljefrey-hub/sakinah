const { app, BrowserWindow } = require("electron");
const http = require("http"), fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..", "out");
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".woff2": "font/woff2", ".svg": "image/svg+xml", ".json": "application/json" };

function serve() {
  return new Promise((ok) => {
    const srv = http.createServer((req, res) => {
      let p = path.join(root, decodeURIComponent(req.url.split("?")[0]));
      if (!p.startsWith(root)) { res.statusCode = 403; return res.end(); }
      if (fs.existsSync(p) && fs.statSync(p).isDirectory()) p = path.join(p, "index.html");
      if (!fs.existsSync(p)) { res.statusCode = 404; return res.end(); }
      res.setHeader("Content-Type", types[path.extname(p)] || "application/octet-stream");
      fs.createReadStream(p).pipe(res);
    });
    srv.listen(0, "127.0.0.1", () => ok(srv.address().port));
  });
}

app.whenReady().then(async () => {
  const port = await serve();
  const win = new BrowserWindow({ width: 430, height: 860, minWidth: 360, autoHideMenuBar: true, title: "Sakina" });
  win.loadURL(`http://127.0.0.1:${port}/`);
});
app.on("window-all-closed", () => app.quit());
