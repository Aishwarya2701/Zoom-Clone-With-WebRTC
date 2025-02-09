const express = require('express');
const app = express();
const server = require('http').Server(app);
const { Server } = require('socket.io'); // Import Socket.IO Server class
const { v4: uuidV4 } = require('uuid');

const io = new Server(server); // Initialize Socket.IO server

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId); // Correct usage of .emit

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId); // Correct usage of .emit
    });
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
