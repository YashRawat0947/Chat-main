import express from 'express';
import { 
  createRoom, 
  getRooms, 
  getRoomMessages, 
  sendMessageToRoom 
} from '../controllers/chat.controller.js';

const router = express.Router();

router.post('/room', createRoom);

router.get('/rooms', getRooms);

router.get('/room/:id/messages', getRoomMessages);

router.post('/room/:id/messages', sendMessageToRoom);

export default router;
