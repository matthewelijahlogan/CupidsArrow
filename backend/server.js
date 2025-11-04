// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// ---------- Setup ----------
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Serve static files from 'static' folder
app.use(express.static(path.join(__dirname, "static")));

// ---------- In-memory game state ----------
const rooms = {}; 
// Structure: {
//   roomId: {
//     players: [socket.id, ...],
//     stages: {
//       stage1: { title: "", description: "", image: "" },
//       stage2: {...},
//       ...
//     }
//   }
// }

// ---------- Socket.IO ----------
io.on("connection", (socket) => {
    console.log(`[SOCKET] User connected: ${socket.id}`);

    // -------- Create Game --------
    socket.on("create_game", () => {
        const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
        rooms[roomId] = {
            players: [socket.id],
            stages: {
                stage1: null,
                stage2: null,
                stage3: null,
                stage4: null,
            }
        };
        socket.join(roomId);
        socket.emit("game_created", { room: roomId });
        console.log(`[SOCKET] Room created: ${roomId} by ${socket.id}`);
    });

    // -------- Join Game --------
    socket.on("join_game", ({ room }) => {
        if (!rooms[room]) {
            socket.emit("error", { message: "Room does not exist!" });
            return;
        }
        rooms[room].players.push(socket.id);
        socket.join(room);
        socket.emit("game_joined", { room });
        socket.to(room).emit("player_joined", { sid: socket.id });

        // Sync existing state for joining player
        socket.emit("state_update", { state: rooms[room].stages });

        console.log(`[SOCKET] ${socket.id} joined room: ${room}`);
    });

    // -------- Spin Task --------
    socket.on("spin_task", ({ room, stage }) => {
        if (!rooms[room]) return;
        // Pick a random task from your tasks list
        const stageIndex = parseInt(stage.replace("stage", "")) - 1;
        const task = tasks[stageIndex][Math.floor(Math.random() * tasks[stageIndex].length)];

        rooms[room].stages[stage] = task;

        // Emit to everyone in room
        io.to(room).emit("update_task", { stageId: stage, task });
        console.log(`[SOCKET] Room ${room} stage ${stage} updated with task: ${task.title}`);
    });

    // -------- Disconnect --------
    socket.on("disconnect", () => {
        console.log(`[SOCKET] User disconnected: ${socket.id}`);
        // Remove from rooms
        Object.keys(rooms).forEach((roomId) => {
            const room = rooms[roomId];
            if (room.players.includes(socket.id)) {
                room.players = room.players.filter(id => id !== socket.id);
                socket.to(roomId).emit("player_left", { sid: socket.id });

                // If room empty, delete it
                if (room.players.length === 0) delete rooms[roomId];
            }
        });
    });
});

// ---------- Start Server ----------
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
