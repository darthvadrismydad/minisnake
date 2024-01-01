const http = require('http');
const fs = require('fs');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const server = http.createServer((req, res) => {
    let path = new URL(req.url, `http://${req.headers.host}`).pathname;
    if (path === '/update' && req.method === 'POST') {
        res.statusCode = 200;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        new Promise((done, rej) => {
            req.on('data', (data) => {
                done(data.toString());
            });
            req.on('error', (err) => {
                rej(err);
            });
        }).then(content =>
            fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                body: JSON.stringify({
                    model: "gpt-3.5-turbo-1106",
                    response_format: { type: "json_object" },
                    messages: [
                        {
                            role: "system",
                            content: `
                            You are a helpful outline shape generator that outputs 2D path points, in the order they should be connected, in JSON format. 
                            You will always respond with the outline of the sprite as an array of { x: number, y: number } json objects.
                            Please keep the shape centered around the origin (0,0) and ensure it's symmetrical.
                            The shape must always be a closed path, so the first and last point should be the same.
                        `.replace(/[\s\n]+/g, ' ').trim()
                        },
                        {
                            role: "user",
                            content
                        }
                    ]
                }),
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + OPENAI_API_KEY,
                }
            }).then(r => r.json()).then(json => {
                res.write(json.choices[0].message.content);
            }).catch(err => {
                console.log(JSON.stringify(err));
                res.statusCode = 400;
                res.write(err.message);
            }).finally(() => {
                res.end();
            })
        );
        return;
    }
    if (path.startsWith('/')) path = path.slice(1);
    if (path === '') path = 'index.html';
    if (path === 'favicon.ico') {
        res.statusCode = 204;
        res.end();
        return;
    }
    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err, req.url);
            res.statusCode = 400;
            res.end();
            return;
        };
        res.writeHead(200, { 'Content-Type': path.endsWith('js') ? 'application/javascript' : 'text/html' });
        res.statusCode = 200;
        res.end(data);
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
