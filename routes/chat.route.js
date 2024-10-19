import express from 'express';
import { 
  createRoom, 
  getRooms, 
  getRoomMessages, 
  sendMessageToRoom 
} from '../controllers/chat.controller.js';

const router = express.Router();

// Route to create or join a room
router.post('/room', createRoom);

// Route to get all available rooms
router.get('/rooms', getRooms);

// Route to get messages from a specific room
router.get('/room/:id/messages', getRoomMessages);

// Route to send a message in a room
router.post('/room/:id/messages', sendMessageToRoom);

export default router;
