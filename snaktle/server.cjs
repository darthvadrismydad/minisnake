const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    let path = new URL(req.url, `http://${req.headers.host}`).pathname;
    if(path.startsWith('/')) path = path.slice(1);
    if(path === '') path = 'index.html';
    if(path === 'favicon.ico') {
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
