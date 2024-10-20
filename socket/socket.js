import Message from '../models/message.model.js';
import Room from '../models/room.model.js';

const onlineUsers = {}; // Store online users per room
const userSockets = {}; // Store socket id for each user

const socketSetup = (io) => {
  io.on('connection', (socket) => {
    console.log('New connection:', socket.id);

    socket.on('joinRoom', async ({ username, room }) => {
      socket.join(room);

      // Initialize the room if it doesn't exist
      if (!onlineUsers[room]) {
        onlineUsers[room] = new Set();
      }

      // Add the user to the room
      onlineUsers[room].add(username);
      userSockets[username] = socket.id;

      // Fetch room information
      const roomInfo = await Room.findById(room);
      
      // Send room information to the user
      socket.emit('roomInfo', { name: roomInfo.name });

      // Notify other users in the room
      io.to(room).emit('message', { username: 'Admin', text: `${username} has joined the room` });

      // Emit the updated list of online users to the room
      io.to(room).emit('onlineUsers', Array.from(onlineUsers[room]));

      // Send chat history for the room
      const roomMessages = await Message.find({ room }).sort({ createdAt: 1 });
      socket.emit('loadMessages', roomMessages);
    });
    // Handle chat messages
    socket.on('chatMessage', async (message) => {
      const newMessage = new Message(message);
      await newMessage.save();
      io.to(message.room).emit('message', message);
    });

    // Typing indicator
    socket.on('typing', ({ username, room }) => {
      socket.to(room).emit('typing', username);
    });

    // Stop typing indicator
    socket.on('stopTyping', (room) => {
      socket.to(room).emit('stopTyping');
    });

    // User leaves the room
    socket.on('leaveRoom', ({ username, room }) => {
      handleUserLeaveRoom(io, socket, username, room);
    });

    // Handle socket disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      handleUserDisconnect(io, socket);
    });
  });
};

function handleUserLeaveRoom(io, socket, username, room) {
  socket.leave(room);
  if (onlineUsers[room]) {
    onlineUsers[room].delete(username);
    io.to(room).emit('message', { username: 'Admin', text: `${username} has left the room` });
    io.to(room).emit('onlineUsers', Array.from(onlineUsers[room]));
  }
  delete userSockets[username];
}

function handleUserDisconnect(io, socket) {
  let disconnectedUser;
  for (const [username, socketId] of Object.entries(userSockets)) {
    if (socketId === socket.id) {
      disconnectedUser = username;
      break;
    }
  }

  if (disconnectedUser) {
    for (const room in onlineUsers) {
      if (onlineUsers[room].has(disconnectedUser)) {
        onlineUsers[room].delete(disconnectedUser);
        io.to(room).emit('message', { username: 'Admin', text: `${disconnectedUser} has disconnected` });
        io.to(room).emit('onlineUsers', Array.from(onlineUsers[room]));
      }
    }
    delete userSockets[disconnectedUser];
  }
}

export default socketSetup;