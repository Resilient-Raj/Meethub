import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || origin.startsWith('http://localhost:')) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST']
  }
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meethub')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const rooms: { [roomId: string]: Set<string> } = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = new Set();
    rooms[roomId].add(socket.id);
    const otherUsers = Array.from(rooms[roomId]).filter(id => id !== socket.id);
    socket.emit('all-users', otherUsers);
    socket.to(roomId).emit('user-connected', socket.id);

    socket.on('disconnect', () => {
      rooms[roomId].delete(socket.id);
      socket.to(roomId).emit('user-disconnected', socket.id);
      if (rooms[roomId].size === 0) delete rooms[roomId];
    });
  });

  socket.on('offer', (offer, to) => {
    socket.to(to).emit('offer', offer, socket.id);
  });

  socket.on('answer', (answer, to) => {
    socket.to(to).emit('answer', answer, socket.id);
  });

  socket.on('ice-candidate', (candidate, to) => {
    socket.to(to).emit('ice-candidate', candidate, socket.id);
  });

  socket.on('chat-message', ({ roomId, userId, text }) => {
    socket.to(roomId).emit('chat-message', { userId, text });
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
