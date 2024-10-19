// server.js
import express from 'express';
import { Server } from 'socket.io';
import http from 'http'; // Make sure to import http module
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import chatRoutes from './routes/chat.route.js';
import socketSetup from './socket/socket.js';
import connectDB from './db/connectDB.js'; // Import connectDB function
import cors from 'cors'


const app = express();
dotenv.config(); // Ensure this line is present

const server = http.createServer(app); // This should work now
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, // Frontend's origin
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Setup Socket.io
socketSetup(io);

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// Connect to MongoDB and start the server
connectDB().then(() => {
  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});