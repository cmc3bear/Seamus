const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

http.createServer(function (req, res) {
  let q = url.parse(req.url, true);
  let ext = path.extname(q.pathname);
  let filePath = '.' + q.pathname;

  if (filePath === './') {
    filePath = './index.html';
  }

  const contentType = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.html': 'text/html',
  };

  res.writeHead(200, { 'Content-Type': contentType[ext] || 'text/html' });

  if (filePath !== './favicon.ico') {
    fs.readFile(filePath, function (err, data) {
      if (err) {
        console.log(`Error: ${err}`);
        res.end();
      } else {
        res.write(data);
        res.end();
      }
    });
  }
}).listen(3000);