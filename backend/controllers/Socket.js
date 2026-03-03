const { Server } = require('socket.io');
const connectedUsers = new Map();
let io;
function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: '*', // à restreindre en prod
    },
  });
  io.on('connection', (socket) => {
    console.log('Utilisateur connecté :', socket.id);
    socket.on('registerUser', (userId) => {
      connectedUsers.set(userId, socket.id);
      console.log('User enregistré :', userId);
      console.log('user Socket' ,connectedUsers.get(userId))
    });

    socket.on('disconnect', () => {
      for (const [userId, id] of connectedUsers.entries()) {
        if (id === socket.id) {
          connectedUsers.delete(userId);
          console.log('User déconnecté :', userId);
          break;
        }
      }
    });
  });
}

function sendTaskNotification(userId, task) {
  const socketId = connectedUsers.get(userId);
  console.log(socketId, userId)
  if (socketId && io) {
    io.to(socketId).emit('newTask', task);
    console.log(`Notification envoyée à l'utilisateur ${userId}`);
    return true;
  }
  return false;
}

module.exports = { initSocket, sendTaskNotification };
