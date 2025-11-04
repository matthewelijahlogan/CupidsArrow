// static/js/gameSocket.js
// Full multiplayer auto-advancing game logic

import { tasks } from './app.js'; // Must be exported from app.js

const socket = io();
let roomId = null;
let currentStageIndex = 0;
let isGameRunning = false;
let countdownInterval = null;

// -------------------------
// DOM elements
// -------------------------
const inviteBtn = document.getElementById("inviteBtn");
const joinBtn = document.getElementById("joinBtn");
const roomPopup = document.getElementById("roomPopup");
const roomCodeDisplay = document.getElementById("roomCodeDisplay");
const copyRoomBtn = document.getElementById("copyRoomBtn");
const gameStatusDisplay = document.getElementById("gameStatus");

// -------------------------
// Room creation / joining
// -------------------------
if (inviteBtn) {
  inviteBtn.addEventListener("click", () => {
    socket.emit("create_game");
    console.log("[SOCKET] Creating game...");
  });
}

socket.on("game_created", (data) => {
  roomId = data.room;
  if (roomCodeDisplay) roomCodeDisplay.textContent = roomId;
  if (roomPopup) roomPopup.classList.remove("hidden");
  console.log(`[SOCKET] Game created, room ID: ${roomId}`);
});

if (copyRoomBtn) {
  copyRoomBtn.addEventListener("click", () => {
    if (!roomId) return alert("No room ID to copy!");
    navigator.clipboard.writeText(roomId)
      .then(() => alert("Room code copied!"))
      .catch(err => console.error("Clipboard error:", err));
  });
}

if (joinBtn) {
  joinBtn.addEventListener("click", () => {
    const code = prompt("Enter room code to join:");
    if (code && code.trim() !== "") {
      socket.emit("join_game", { room: code.trim() });
      console.log(`[SOCKET] Attempting to join room: ${code}`);
    }
  });
}

socket.on("game_joined", (data) => {
  roomId = data.room;
  alert(`Joined room: ${roomId}`);
  console.log(`[SOCKET] Successfully joined room: ${roomId}`);
});

socket.on("player_joined", (data) => {
  console.log(`[SOCKET] Other player joined: ${data.sid}`);
  if (!isGameRunning) startGameLoop();
});

socket.on("player_left", (data) => {
  console.log(`[SOCKET] Player left: ${data.sid}`);
  alert("The other player has left the room.");
  stopGameLoop();
});

// -------------------------
// Auto-advancing game loop
// -------------------------
function startGameLoop() {
  if (isGameRunning) return;
  isGameRunning = true;
  currentStageIndex = 0;
  console.log("[GAME] Starting auto progression...");

  runNextStage();
}

function stopGameLoop() {
  isGameRunning = false;
  clearInterval(countdownInterval);
}

function runNextStage() {
  if (!isGameRunning) return;

  if (currentStageIndex >= tasks.length) {
    console.log("[GAME] All stages complete.");
    socket.emit("game_complete", { room: roomId });
    updateGameStatus("🎉 Game complete!");
    stopGameLoop();
    return;
  }

  const stage = tasks[currentStageIndex];
  console.log(`[GAME] Running stage ${currentStageIndex + 1}: ${stage.title}`);
  socket.emit("update_task", { room: roomId, stageId: `stage_${currentStageIndex + 1}`, task: stage });
  
  // Broadcast to all players
  updateTaskDisplay(`stage_${currentStageIndex + 1}`, stage);
  startStageCountdown(stage.duration || 20, () => {
    currentStageIndex++;
    runNextStage();
  });
}

// -------------------------
// Countdown logic
// -------------------------
function startStageCountdown(seconds, onComplete) {
  clearInterval(countdownInterval);
  let remaining = seconds;
  const timerDisplay = document.getElementById("globalTimer");

  if (timerDisplay) timerDisplay.textContent = formatTime(remaining);

  countdownInterval = setInterval(() => {
    remaining--;
    if (timerDisplay) timerDisplay.textContent = formatTime(remaining);
    if (remaining <= 0) {
      clearInterval(countdownInterval);
      if (typeof onComplete === "function") onComplete();
    }
  }, 1000);
}

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// -------------------------
// Task display sync
// -------------------------
socket.on("update_task", (data) => {
  const { stageId, task } = data;
  updateTaskDisplay(stageId, task);
});

function updateTaskDisplay(stageId, task) {
  const display = document.querySelector(`#${stageId} .taskDisplay`);
  if (!display) return;

  const titleEl = display.querySelector(".taskTitle");
  const descEl = display.querySelector(".taskDescription");
  const imgEl = display.querySelector(".taskImage");

  if (titleEl) titleEl.textContent = task.title || "";
  if (descEl) descEl.textContent = task.description || "";
  if (imgEl && task.image) imgEl.src = task.image;

  updateGameStatus(`Now playing: ${task.title}`);
  console.log(`[SOCKET] Stage ${stageId} updated with task: ${task.title}`);
}

// -------------------------
// State sync for reconnects
// -------------------------
socket.on("state_update", (data) => {
  const state = data.state;
  if (!state) return;

  Object.keys(state).forEach(stageId => {
    const task = state[stageId];
    updateTaskDisplay(stageId, task);
  });
});

// -------------------------
// UI helper
// -------------------------
function updateGameStatus(msg) {
  if (gameStatusDisplay) gameStatusDisplay.textContent = msg;
  console.log(`[STATUS] ${msg}`);
}
