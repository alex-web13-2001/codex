const { Server } = require('socket.io');

const createGateway = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    const { userId, projectId } = socket.handshake.query;
    if (projectId) {
      socket.join(`project:${projectId}`);
    }
    if (userId) {
      socket.join(`user:${userId}`);
    }

    socket.on('subscribe', ({ projectId: pId, userId: uId }) => {
      if (pId) {
        socket.join(`project:${pId}`);
      }
      if (uId) {
        socket.join(`user:${uId}`);
      }
    });

    socket.on('unsubscribe', ({ projectId: pId, userId: uId }) => {
      if (pId) {
        socket.leave(`project:${pId}`);
      }
      if (uId) {
        socket.leave(`user:${uId}`);
      }
    });
  });

  const emitTaskEvent = (projectId, event, payload) => {
    io.to(`project:${projectId}`).emit(`task:${event}`, payload);
  };

  const emitProjectEvent = (projectId, event, payload) => {
    io.to(`project:${projectId}`).emit(`project:${event}`, payload);
  };

  const emitInvitationEvent = (userId, payload) => {
    io.to(`user:${userId}`).emit('invitation', payload);
  };

  return {
    io,
    emitTaskEvent,
    emitProjectEvent,
    emitInvitationEvent,
  };
};

module.exports = createGateway;
