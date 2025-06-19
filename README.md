# MeetHub

 video conferencing web app built with the MERN stack (MongoDB, Express.js, React, Node.js) featuring real-time video, audio, and group chat using WebRTC and Socket.IO.

## Features
- Create or join video rooms
- Real-time group video/audio (WebRTC mesh)
- Group chat for all users in a room
- Camera and microphone controls
- Modern dark UI
- Robust multi-user mesh connectivity

## Tech Stack
- **Frontend:** React + Vite + TypeScript
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB
- **Real-time:** WebRTC, Socket.IO

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- MongoDB (local or cloud)

### Installation

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd Collabria
   ```

2. **Install dependencies:**
   - Backend:
     ```sh
     cd server
     npm install
     ```
   - Frontend:
     ```sh
     cd ../client
     npm install
     ```

3. **Set up environment variables:**
   - Copy `server/.env.example` to `server/.env` (or create manually):
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/meethub
     ```

4. **Start the backend:**
   ```sh
   cd server
   npm run build
   npm start
   ```

5. **Start the frontend:**
   ```sh
   cd ../client
   npm run dev
   ```

6. **Open your browser:**
   - Visit `http://localhost:5173` (or the port shown in your terminal)

## Usage
- Enter a room ID to join or create a new one.
- Enter your name and join the room.
- Allow camera/microphone access when prompted.
- Use the controls to mute/unmute, toggle camera, or leave the room.
- Chat with other users in the room.

## Security
- **Do not commit your `.env` files** to version control.
- For production, set up HTTPS and secure environment variables.

## License
MIT
