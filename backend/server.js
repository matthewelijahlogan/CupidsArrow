// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

// ---------- Setup ----------
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" } // allow front-end connections
});

const PORT = process.env.PORT || 3000;

// ---------- Serve static files ----------
app.use(express.static(path.join(__dirname, "www")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "www", "index.html"));
});

// ---------- In-memory game state ----------
const rooms = {}; 
// Structure: { roomId: { players: [socket.id], stages: { stage1: {...}, ... } } }

// ---------- Tasks (example placeholders, replace with full tasks) ----------
const tasks = [
  [ // Stage 1
    { title: "Task 1", description: "Do something fun", image: "img/text1.jpg" },
    { title: "Task 2", description: "Do something else", image: "img/text2.jpg" }
  ],
  [ // Stage 2
    { title: "Task A", description: "Stage 2 task", image: "img/tease1.jpg" },
    { title: "Task B", description: "Another stage 2", image: "img/tease2.jpg" }
  ],
  [ // Stage 3
    { title: "Task X", description: "Stage 3 task", image: "img/extra1.jpg" },
    { title: "Task Y", description: "Another stage 3", image: "img/extra2.jpg" }
  ],
  [ // Stage 4
    { title: "Task M", description: "Stage 4 task", image: "img/final1.jpg" },
    { title: "Task N", description: "Another stage 4", image: "img/final2.jpg" }
  ]
];

// ---------- Socket.IO ----------
io.on("connection", (socket) => {
  console.log(`[SOCKET] User connected: ${socket.id}`);

  // Create Game
  socket.on("create_game", () => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    rooms[roomId] = {
      players: [socket.id],
      stages: { stage1: null, stage2: null, stage3: null, stage4: null }
    };
    socket.join(roomId);
    socket.emit("game_created", { room: roomId });
    console.log(`[CREATE] Room ${roomId} created by ${socket.id}`);
  });

  // Join Game
  socket.on("join_game", ({ room }) => {
    if (!rooms[room]) {
      socket.emit("error", { message: "Room does not exist!" });
      return;
    }
    rooms[room].players.push(socket.id);
    socket.join(room);
    socket.emit("game_joined", { room });
    socket.to(room).emit("player_joined", { sid: socket.id });

    // Sync state
    socket.emit("state_update", { state: rooms[room].stages });
    console.log(`[JOIN] ${socket.id} joined room: ${room}`);
  });

  // Spin Task
  socket.on("spin_task", ({ room, stage }) => {
    if (!rooms[room]) return;
    const stageIndex = parseInt(stage.replace("stage", "")) - 1;
    const taskList = tasks[stageIndex] || [];
    if (!taskList.length) return;
    const task = taskList[Math.floor(Math.random() * taskList.length)];
    rooms[room].stages[stage] = task;

    io.to(room).emit("update_task", { stageId: stage, task });
    console.log(`[TASK] Room ${room} stage ${stage} → ${task.title}`);
  });

  // Disconnect
  socket.on("disconnect", () => {
    console.log(`[DISCONNECT] User disconnected: ${socket.id}`);
    Object.keys(rooms).forEach((roomId) => {
      const room = rooms[roomId];
      if (room.players.includes(socket.id)) {
        room.players = room.players.filter(id => id !== socket.id);
        socket.to(roomId).emit("player_left", { sid: socket.id });
        if (room.players.length === 0) {
          delete rooms[roomId];
          console.log(`[CLEANUP] Room ${roomId} deleted`);
        }
      }
    });
  });
});

// ---------- Start Server ----------
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
