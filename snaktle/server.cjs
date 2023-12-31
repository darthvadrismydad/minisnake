const http = require('http');
const fs = require('fs');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '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';

const server = http.createServer((req, res) => {
    let path = new URL(req.url, `http://${req.headers.host}`).pathname;
    if (path === '/update' && req.method === 'POST') {
        res.statusCode = 200;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "You always generate a JSON compliant array of 100 coordinates in the format [x,y|x2,y2|x3,y3|xN,yN] that approximates a sprite representing whatever the user says"
                    },
                    {
                        role: "user",
                        content: "sunflower"
                    }
                ]
            }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + OPENAI_API_KEY,
            }
        }).then(r => r.json()).then(json => {
            const coords = json.choices[0].message.content
                .split('|')
                .map(c => { 
                    const [x, y] = c.split(',')
                    return { x: parseInt(x) ?? x, y: parseInt(y) ??  y };
                });

            res.write(JSON.stringify(coords));
        }).catch(err => {
            console.log(JSON.stringify(err));
            res.statusCode = 400;
            res.write(err.message);
        }).finally(() => {
            res.end();
        });
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
