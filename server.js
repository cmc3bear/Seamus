const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config({ path: './local.env' });

const apiKey = process.env.OPENAI_API_KEY;
const apiUrl = "https://api.openai.com/v1/engines/davinci-codex/completions";

http.createServer(function (req, res) {
    let q = url.parse(req.url, true);
    let ext = path.extname(q.pathname);
    let filePath = '.' + q.pathname;

    if (filePath === './') {
        filePath = './index.html';
    }

    if (ext === '.js') {
        res.writeHead(200, { 'Content-Type': 'text/javascript' });
    } else if (ext === '.css') {
        res.writeHead(200, { 'Content-Type': 'text/css' });
    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
    }

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
}).listen(8080);

function sendToGpt(prompt) {
    return axios.post(apiUrl, {
        prompt: prompt,
        max_tokens: 100,
        n: 1,
        stop: ["\n"],
    }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
        },
    }).then(response => response.data.choices[0].text)
      .catch(error => {
          console.error("Error fetching data from GPT:", error);
          throw error;
      });
}

