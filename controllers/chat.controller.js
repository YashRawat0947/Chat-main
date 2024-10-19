import Room from '../models/room.model.js';
import Message from '../models/message.model.js';

// Create a new chat room
export const createRoom = async (req, res) => {
  const { name } = req.body;
  try {
    // Check if room with the same name already exists
    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({ error: 'Room already exists' });
    }

    // Create and save the new room
    const room = new Room({ name });
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ error: 'Room creation failed', details: error.message });
  }
};

// Get messages for a specific room
export const getRoomMessages = async (req, res) => {
  const { id } = req.params;
  try {
    const messages = await Message.find({ room: id }).sort({ createdAt: 1 });
    if (!messages) {
      return res.status(404).json({ error: 'No messages found for this room' });
    }
    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: 'Failed to load messages', details: error.message });
  }
};

// Get all available rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    if (!rooms || rooms.length === 0) {
      return res.status(404).json({ error: 'No rooms found' });
    }
    res.status(200).json(rooms);
  } catch (error) {
    res.status(400).json({ error: 'Failed to load rooms', details: error.message });
  }
};

// Send a message in a room
export const sendMessageToRoom = async (req, res) => {
  const { id } = req.params; // Room ID
  const { username, message } = req.body;

  try {
    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const newMessage = new Message({
      room: id,
      username,
      message,
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ error: 'Failed to send message', details: error.message });
  }
};
