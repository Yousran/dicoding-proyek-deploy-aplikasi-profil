const http = require('http');
const fs = require('fs');
const path = require('path');

const host = '0.0.0.0'; // Memungkinkan akses eksternal
const port = 8080;

const httpServer = http.createServer(httpHandler);

httpServer.listen(port, host, () => {
    console.log(`HTTP server running at http://${host}:${port}/`);
});

function httpHandler(req, res) {
    let filePath = '.' + req.url;

    // Jika URL adalah "/", gunakan file index.html
    if (filePath === './') {
        filePath = './index.html';
    }

    // Pastikan hanya melayani file dari direktori server
    filePath = path.normalize(filePath);

    // Baca file dan kirim respons
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // File tidak ditemukan
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
            } else {
                // Kesalahan server lainnya
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('500 Internal Server Error');
            }
        } else {
            // Tipe konten berdasarkan ekstensi file
            const ext = path.extname(filePath);
            const mimeType = {
                '.html': 'text/html',
                '.css': 'text/css',
                '.js': 'application/javascript',
                '.json': 'application/json',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.gif': 'image/gif',
                '.svg': 'image/svg+xml',
            };

            const contentType = mimeType[ext] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
}