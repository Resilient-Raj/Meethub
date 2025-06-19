"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: (origin, callback) => {
            if (!origin || origin.startsWith('http://localhost:')) {
                callback(null, true);
            }
            else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST']
    }
});
// Middleware
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || origin.startsWith('http://localhost:')) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
// MongoDB Connection
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/meethub')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
const rooms = {};
// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('join-room', (roomId, userId) => {
        socket.join(roomId);
        if (!rooms[roomId])
            rooms[roomId] = new Set();
        rooms[roomId].add(socket.id);
        // Send list of other users in the room to the new user
        const otherUsers = Array.from(rooms[roomId]).filter(id => id !== socket.id);
        socket.emit('all-users', otherUsers);
        // Notify others (send both socket.id and userId for display)
        socket.to(roomId).emit('user-connected', socket.id);
        socket.on('disconnect', () => {
            rooms[roomId].delete(socket.id);
            socket.to(roomId).emit('user-disconnected', socket.id);
            if (rooms[roomId].size === 0)
                delete rooms[roomId];
        });
    });
    // WebRTC signaling events
    socket.on('offer', (offer, to) => {
        socket.to(to).emit('offer', offer, socket.id);
    });
    socket.on('answer', (answer, to) => {
        socket.to(to).emit('answer', answer, socket.id);
    });
    socket.on('ice-candidate', (candidate, to) => {
        socket.to(to).emit('ice-candidate', candidate, socket.id);
    });
    // Group chat
    socket.on('chat-message', ({ roomId, userId, text }) => {
        socket.to(roomId).emit('chat-message', { userId, text });
    });
});
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
