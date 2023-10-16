const net = require('net');
const port = 3000;
const host = '127.0.0.1';

const server = net.createServer();

server.listen(port, host, () => {
    console.log(`Alarm server listening on port ${port}!`);
})

server.on('connection', (socket) => {
    console.log(`NEW CONNECTION: ${socket.remoteAddress}:${socket.remotePort}`);

    socket.on('data', (data) => {
        console.log(`RECEIVED DATA FROM ${socket.remoteAddress}: ${data}`);
        socket.write(data);
    });

    socket.on('close', (data) => {
        console.log(`CLOSED CONNECTION WITH ${socket.remoteAddress}`);
    });
})
