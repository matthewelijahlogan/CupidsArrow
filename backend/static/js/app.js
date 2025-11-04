// js/app.js

// -------------------------
// Task Data
// -------------------------
export const tasksByStage = {
  1: [
    { title: "Early Tease", description: "Send a subtle hint about tonight.", image: "img/text1.jpg" },
    { title: "Memory Spark", description: "Text them about a spicy memory you both loved.", image: "img/text2.jpg" },
    { title: "Countdown Message", description: "Let them know you’re counting the hours.", image: "img/text3.jpg" }
  ],
  2: [
    { title: "Slow Striptease", description: "Do a slow, playful striptease.", image: "img/tease1.jpg" },
    { title: "Lap Dance Tease", description: "Give a teasing lap dance.", image: "img/tease3.jpg" },
    { title: "Dance Close", description: "Dance close, hips touching.", image: "img/tease6.jpg" }
  ],
  3: [
    { title: "Plumber", description: "He stands over her head at the edge of the bed.", image: "img/FellacioPositions/plumber.png" },
    { title: "Snake Charmer", description: "He sits while she kneels charming the snake.", image: "img/FellacioPositions/snake_charmer.png" },
    { title: "Guillotine", description: "He straddles her face holding her legs.", image: "img/FellacioPositions/guillotine.png" }
  ],
  4: [
    { title: "Missionary", description: "Classic, intimate, eye contact.", image: "img/positions/missionary.png" },
    { title: "Cowgirl", description: "Partner on top, riding with control.", image: "img/positions/cowgirl.png" },
    { title: "Doggy Style", description: "From behind with strong rhythm.", image: "img/positions/doggy_style.png" }
  ]
};

// -------------------------
// Utility
// -------------------------
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

// Stage control
function toStage(n){
  $$('.stage').forEach(s => s.classList.toggle('active', s.id === `stage${n}`));
  console.log(`[STAGE] Moved to Stage ${n}`);
}
window.toStage = toStage;

// -------------------------
// DOM References
// -------------------------
const popup    = $('#positionPopup');
const closeBtn = $('#closePopup');
const pTitle   = $('#positionTitle');
const pDesc    = $('#positionDescription');
const pImg     = $('#positionImage');
const ding     = $('#dingSound');

// -------------------------
// Game State
// -------------------------
const state = {
  stage: 1,
  timers: {},
  secs: { 2: 180, 3: 180, 4: 180 }
};

// -------------------------
// Core Functions
// -------------------------
function showTask(stage){
  const list = tasksByStage[stage];
  const task = list[Math.floor(Math.random() * list.length)];
  const box = $(`#taskDisplay${stage}`);
  if (!box) return;

  box.querySelector('.taskTitle').textContent = task.title;
  box.querySelector('.taskDescription').textContent = task.description;
  box.querySelector('.taskImage').src = task.image;

  // preload popup
  pTitle.textContent = task.title;
  pDesc.textContent  = task.description;
  pImg.src           = task.image;

  console.log(`[TASK] Stage ${stage}: ${task.title}`);
}

function startStageTimer(stage, onDone){
  const disp = $(`#timer${stage}`);
  let secs = state.secs[stage];
  clearInterval(state.timers[stage]);
  state.timers[stage] = setInterval(() => {
    secs--;
    disp.textContent = fmt(secs);
    if (secs <= 0) {
      clearInterval(state.timers[stage]);
      ding.currentTime = 0;
      ding.play();
      onDone();
    }
  }, 1000);
}

// Auto transition helper
function nextStage(){
  const cur = state.stage;
  if (cur >= 4) {
    console.log("[GAME] Completed all stages!");
    return;
  }

  // Show stage complete message briefly
  const msg = document.createElement('div');
  msg.className = 'stage-msg';
  msg.textContent = `Stage ${cur} complete — next starting...`;
  document.body.appendChild(msg);
  setTimeout(() => msg.remove(), 3000);

  setTimeout(() => {
    const next = cur + 1;
    state.stage = next;
    toStage(next);
    beginStage(next);
  }, 3000);
}

// Begin each stage logic automatically
function beginStage(stage){
  console.log(`[GAME] Starting Stage ${stage}`);
  showTask(stage);

  if (stage === 1) {
    // Immediately move to next stage after a short delay
    setTimeout(() => nextStage(), 4000);
  } 
  else if (stage === 2 || stage === 3) {
    startStageTimer(stage, () => nextStage());
  } 
  else if (stage === 4) {
    popup.classList.remove('hidden');
    ding.play();
    console.log("[GAME] Final stage reached — showing popup.");
  }
}

// -------------------------
// Init Game Flow
// -------------------------
document.addEventListener('DOMContentLoaded', () => {
  toStage(1);
  beginStage(1);
});

// -------------------------
// Multiplayer Hooks (optional)
// -------------------------
import io from '/js/gameSocket.js';
const socket = io();
const roomId = 'room1';

socket.emit('joinRoom', { room: roomId });

function emitTaskAccepted(stage, taskTitle){
  socket.emit('taskAccepted', { room: roomId, stage, taskTitle });
}

socket.on('taskAccepted', data => {
  console.log(`[MULTI] Player accepted task: ${data.taskTitle}`);
});
