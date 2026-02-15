const { Server } = require('socket.io');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    socket.on('join-board', (boardId) => {
      if (boardId) {
        socket.join(boardId.toString());
      }
    });

    socket.on('leave-board', (boardId) => {
      if (boardId) {
        socket.leave(boardId.toString());
      }
    });
  });

  return io;
};

module.exports = { initSocket };
