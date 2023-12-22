const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3000;
const QUEUE_START_TIME = new Date(Date.now() + 1000 * 60 * 0.2); // Adjust this as needed
const VISIT_DURATION = 15 * 60 * 1000; // 15 minutes

let queue = [];
let activeUser = null;
let activeUserTimer = null;

io.on('connection', (socket) => {
    // Emit initial queue status when a new user connects
    emitQueueStatus(socket);

    // Check the queue on a new connection
    checkQueue(socket);

    // Check the queue status periodically (e.g., every 5 seconds)
    const intervalId = setInterval(() => {
        checkQueue(socket);
        emitQueueStatus(socket); // Update the user on their queue status
    }, 5000);

    // Handle user disconnection
    socket.on('disconnect', () => {
        clearInterval(intervalId); // Stop the interval for this user
        removeFromQueue(socket.id); // Remove the user from the queue
        emitQueueStatusToAll(); // Update all remaining users
    });
});

function emitQueueStatus(socket) {
    const position = queue.indexOf(socket.id) + 1; // Position in the queue (0 means not in queue)
    const status = {
        position: position,
        queueLength: queue.length,
        inQueue: position > 0
    };
    socket.emit('queueStatus', status);
}

function emitQueueStatusToAll() {
    io.emit('queueStatus', {
        position: null, // Individual position doesn't make sense for a broadcast
        queueLength: queue.length,
        inQueue: false // This indicates it's a broadcast message
    });
}

function removeFromQueue(userId) {
    const index = queue.indexOf(userId);
    if (index > -1) {
        queue.splice(index, 1);
    }

    if (activeUser === userId) {
        activeUser = queue.length > 0 ? queue.shift() : null;
        clearTimeout(activeUserTimer);
        if (activeUser) {
            activeUserTimer = setTimeout(() => {
                activeUser = queue.length > 0 ? queue.shift() : null;
                io.emit('updateAccess', { activeUser });
            }, VISIT_DURATION);
        }
        io.emit('updateAccess', { activeUser });
    }
}

function checkQueue(socket) {
    const currentTime = new Date();
    if (currentTime >= QUEUE_START_TIME) {
        if (!queue.includes(socket.id)) {
            queue.push(socket.id);
        }

        if (!activeUser && queue.length > 0) {
            activeUser = queue.shift();
            activeUserTimer = setTimeout(() => {
                activeUser = queue.length > 0 ? queue.shift() : null;
                io.emit('updateAccess', { activeUser });
            }, VISIT_DURATION);
        }

        socket.emit('updateAccess', { activeUser });
    } else {
        socket.emit('updateAccess', { activeUser: null });
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
