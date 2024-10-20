import express from 'express';
import { Server } from 'socket.io';
import http from 'http'; 
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import chatRoutes from './routes/chat.route.js';
import socketSetup from './socket/socket.js';
import connectDB from './db/connectDB.js'; 
import cors from 'cors'


const app = express();
dotenv.config(); 

const server = http.createServer(app);
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

socketSetup(io);

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

connectDB().then(() => {
  server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});