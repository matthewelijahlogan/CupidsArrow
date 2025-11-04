// -------------------------
// Task Data
// -------------------------
const tasksByStage = {
  1: [
    { title: "Slow Striptease",       description: "Do a slow, playful striptease while keeping eye contact.",         image: "img/tease1.jpg" },
    { title: "Kiss Trail",            description: "Kiss them softly from their neck to their belly.",                  image: "img/tease2.jpg" },
    { title: "Lap Dance Tease",       description: "Give a lap dance with just enough touch to drive them wild.",       image: "img/tease3.jpg" },
    { title: "Whisper Game",          description: "Whisper something dirty or sweet in their ear—make them shiver.",  image: "img/tease4.jpg" },
    { title: "Light Fingertips",      description: "Run your fingertips over their arms, neck, and chest lightly.",     image: "img/tease5.jpg" },
    { title: "Dance Close",           description: "Put on a slow song and dance close, hips touching.",                image: "img/tease6.jpg" },
    { title: "Clothing Tease",        description: "Pull at their clothing like you're about to undress them… but don’t.", image: "img/tease7.jpg" },
    { title: "Pinned Kiss",           description: "Gently pin them against a wall and kiss them slowly.",              image: "img/tease8.jpg" },
    { title: "Blindfold Tease",       description: "Blindfold them and kiss different spots—make them guess where.",    image: "img/tease9.jpg" },
    { title: "Hair Tug",              description: "Run your hands through their hair and gently tug while kissing.",   image: "img/tease10.jpg" },
    { title: "Straddle & Stare",      description: "Straddle them fully clothed and just stare into their eyes.",       image: "img/tease11.jpg" },
    { title: "Body Massage",          description: "Give them a soft massage that slowly gets more intimate.",          image: "img/tease12.jpg" },
    { title: "Clothes-On Makeout",    description: "Make out passionately but keep all your clothes on.",               image: "img/tease13.jpg" },
    { title: "Take Control",          description: "Lightly push them onto the bed or couch, then hover above.",        image: "img/tease14.jpg" },
    { title: "Lip Bite",              description: "Bite their lip gently during a long kiss.",                         image: "img/tease15.jpg" },
    { title: "Ice Cube Tease",        description: "Trace an ice cube over their neck or stomach.",                     image: "img/tease16.jpg" },
    { title: "Tension Build",         description: "Tease them for 2 minutes—no kissing allowed.",                      image: "img/tease17.jpg" },
    { title: "Breath on Skin",        description: "Hover your mouth over their skin and breathe slowly—no touch.",     image: "img/tease18.jpg" },
    { title: "Smirk & Walk Away",     description: "Say something dirty… then walk away.",                              image: "img/tease19.jpg" },
    { title: "Unzip Me",              description: "Let them unzip your top—slowly—while you kiss them.",               image: "img/tease20.jpg" },
    { title: "Touch Only",            description: "Use only your hands to turn them on—no kissing.",                   image: "img/tease21.jpg" },
    { title: "Dirty Whisper",         description: "Whisper what you’re going to do to them tonight.",                  image: "img/tease22.jpg" },
    { title: "Hold Their Hands",      description: "Hold their wrists gently while you kiss them everywhere else.",     image: "img/tease23.jpg" },
    { title: "Just One Kiss",         description: "Give them one deep kiss, then back away and smile.",                image: "img/tease24.jpg" },
    { title: "Slow Crawl",            description: "Crawl toward them slowly and let your eyes say it all.",            image: "img/tease25.jpg" }
  ],
  2: [
    { title: "Plumber",         
      description: "He stands over her while she rests her head on the edge of the bed.", 
      image: "img/FellacioPositions/plumber.png"
    },
    { title: "Fire Hydrant",
      description: "Relaxed doggy position with full access. Perfect for deep oral.",
      image: "img/FellacioPositions/fire_hydrant.png"
    },
    { title: "Guillotine",
      description: "With legs in hand he straddles her face.",
      image: "img/FellacioPositions/guillotine.png"
    },
    { title: "Snake Charmer",
      description: "He sits on chair while she kneels in front charming the snake.",
      image: "img/FellacioPositions/snake_charmer.png"
    },  
    { title: "Face Sitting",
      description: "Straddle their face and take control of the rhythm.",
      image: "img/FellacioPositions/face_sitting.png"
    },
    { title: "Edge of Bed",
      description: "Lie back on the edge while they kneel — wide access.",
      image: "img/FellacioPositions/edge_of_bed.png"
    },
    { title: "Virgo",
      description: "She stands legs split while he kneels under her.",
      image: "img/FellacioPositions/virgo.png"
    },
    { title: "Car Mechanic",
      description: "He lies on the edge of the bed while she towers over him legs spread.",
      image:"img/FellacioPositions/car_mechanic.png"
    },
    { title: "69",
      description: "A classic she lies on top and enjoy one another.",
      image:"img/FellacioPositions/69.png"
    },
    { title: "Bermuda Triangle",
      description: "She straddles his face standing while she bends over to return the favor.",
      image:"img/FellacioPositions/Bermuda_Triangle.png"
    },
    {
      title: "Face Sitting",
      description: "One partner straddles the other's face for oral pleasure. Dominant and intimate.",
      image: "img/positions/face_sitting.png"
    },

  ],
  3: [
    {
      title: "Missionary",
      description: "A classic and intimate face-to-face position. Great for eye contact and closeness.",
      image: "img/positions/missionary.png"
    },
    {
      title: "Cowgirl",
      description: "Partner on top, riding with control. Perfect for letting them set the pace.",
      image: "img/positions/cowgirl.png"
    },
    {
      title: "Reverse Cowgirl",
      description: "Back turned, facing away, offering a unique visual and feel.",
      image: "img/positions/reverse_cowgirl.png"
    },
    {
      title: "Doggy Style",
      description: "From behind with strong rhythm. Deep and primal.",
      image: "img/positions/doggy_style.png"
    },
    {
      title: "Spooning",
      description: "Lying on the side for gentle, lazy passion.",
      image: "img/positions/spooning.png"
    },
    {
      title: "Standing",
      description: "Great for adventurous quickies or shower play.",
      image: "img/positions/standing.png"
    },
    {
      title: "Seated",
      description: "Lap straddling in a chair. Cozy and sensual.",
      image: "img/positions/seated.png"
    },
    {
      title: "Lap Dance",
      description: "Teasing grind before sliding into a deep connection.",
      image: "img/positions/lap_dance.png"
    },
    {
      title: "Side-by-side",
      description: "Both lying down, intimate and soft.",
      image: "img/positions/side_by_side.png"
    },
    {
      title: "The Lotus",
      description: "Cross-legged embrace — emotionally and physically connected.",
      image: "img/positions/lotus.png"
    },
    {
      title: "Butterfly",
      description: "Partner lies on their back at the edge of a surface while the other stands or kneels — perfect for deep angles.",
      image: "img/positions/butterfly.png"
    },
    {
      title: "Bridge",
      description: "One partner forms a bridge by arching their back while the other enters from above. Demanding but rewarding.",
      image: "img/positions/bridge.png"
    },
    {
      title: "Flatiron",
      description: "One lies flat with legs together while the other enters from behind — deep and intense.",
      image: "img/positions/flatiron.png"
    },
    {
      title: "Piledriver",
      description: "Intense and acrobatic — one partner lies with legs up and back while the other penetrates downward.",
      image: "img/positions/piledriver.png"
    },
    {
      title: "Crab",
      description: "One partner sits with arms behind and hips lifted, the other mounts from the front or back.",
      image: "img/positions/crab.png"
    },
    {
      title: "Lazy Dog",
      description: "Similar to doggy style, but both partners are on their knees and forearms for a more relaxed version.",
      image: "img/positions/lazy_dog.png"
    },
    {
      title: "Standing Wheelbarrow",
      description: "One partner holds the other's legs mid-air while they support themselves on their arms. Athletic and adventurous.",
      image: "img/positions/standing_wheelbarrow.png"
    },
    {
      title: "Corkscrew",
      description: "Lying on the side with one leg elevated and twisted — fantastic for hitting new angles.",
      image: "img/positions/corkscrew.png"
    },
    {
      title: "Full Nelson",
      description: "Put her in a full nelson and have your way with her.",
      image: "img/positions/FullNelson.png"
    }
  ]
};

// -------------------------
// Utility & DOM
// -------------------------
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const fmt = s => `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;

const popup = $('#positionPopup');
const closeBtn = $('#closePopup');
const pTitle = $('#positionTitle');
const pDesc = $('#positionDescription');
const pImg = $('#positionImage');
const ding = $('#dingSound');

let state = { stage: 1, timers: {}, secs: { 1:180,2:180,3:180 } };

// -------------------------
// Stage & Task Logic
// -------------------------
function toStage(n){
  $$('.stage').forEach(s => s.classList.toggle('active', s.id === `stage${n}`));
  console.log(`[STAGE] Moved to Stage ${n}`);
}

function showTask(stage){
  const list = tasksByStage[stage];
  const task = list[Math.floor(Math.random()*list.length)];
  const box = $(`#taskDisplay${stage}`);
  if (!box) return;

  box.querySelector('.taskTitle').textContent = task.title;
  box.querySelector('.taskDescription').textContent = task.description;
  box.querySelector('.taskImage').src = task.image;

  // preload popup
  pTitle.textContent = task.title;
  pDesc.textContent = task.description;
  pImg.src = task.image;

  console.log(`[TASK] Stage ${stage}: ${task.title}`);
}

function startStageTimer(stage,onDone){
  const disp = $(`#timer${stage}`);
  let secs = state.secs[stage];
  clearInterval(state.timers[stage]);
  state.timers[stage] = setInterval(()=>{
    secs--;
    disp.textContent = fmt(secs);
    if(secs<=0){
      clearInterval(state.timers[stage]);
      ding.currentTime=0;
      ding.play();
      onDone();
    }
  },1000);
}

function nextStage(){
  const cur = state.stage;
  if(cur>=4){
    console.log("[GAME] Completed all stages!");
    updateGameStatus("🎉 Game complete!");
    return;
  }

  const msg = document.createElement('div');
  msg.className='stage-msg';
  msg.textContent=`Stage ${cur} complete — next starting...`;
  document.body.appendChild(msg);
  setTimeout(()=>msg.remove(),3000);

  setTimeout(()=>{
    const next=cur+1;
    state.stage=next;
    toStage(next);
    beginStage(next);
  },3000);
}

function beginStage(stage){
  console.log(`[GAME] Starting Stage ${stage}`);
  showTask(stage);

  if(stage===1){
    setTimeout(()=>nextStage(),4000);
  } else if(stage===1 || stage===2){
    startStageTimer(stage,()=>nextStage());
  } else if(stage===3){
    popup.classList.remove('hidden');
    ding.play();
    console.log("[GAME] Final stage reached — showing popup.");
  }
}

// -------------------------
// Init game flow
// -------------------------
document.addEventListener('DOMContentLoaded',()=>{
  toStage(1);
  beginStage(1);
});

// -------------------------
// SocketIO Multiplayer
// -------------------------
const socket = io();
let roomId = 'room1';

socket.emit('joinRoom',{room: roomId});

function emitTaskAccepted(stage,taskTitle){
  socket.emit('taskAccepted',{room:roomId,stage,taskTitle});
}

socket.on('taskAccepted',data=>{
  console.log(`[MULTI] Player accepted task: ${data.taskTitle}`);
});

// Optional: room invite UI
const inviteBtn = $('#inviteBtn');
const joinBtn = $('#joinBtn');
const roomPopup = $('#roomPopup');
const roomCodeDisplay = $('#roomCodeDisplay');
const copyRoomBtn = $('#copyRoomBtn');
const gameStatusDisplay = $('#gameStatus');

if(inviteBtn){
  inviteBtn.addEventListener('click',()=>{
    socket.emit('create_game');
    console.log("[SOCKET] Creating game...");
  });
}
if(copyRoomBtn){
  copyRoomBtn.addEventListener('click',()=>{
    if(!roomId) return alert("No room ID to copy!");
    navigator.clipboard.writeText(roomId).then(()=>alert("Room code copied!"));
  });
}
if(joinBtn){
  joinBtn.addEventListener('click',()=>{
    const code=prompt("Enter room code to join:");
    if(code) socket.emit('join_game',{room:code.trim()});
  });
}

socket.on("game_created",(data)=>{
  roomId=data.room;
  if(roomCodeDisplay) roomCodeDisplay.textContent=roomId;
  if(roomPopup) roomPopup.classList.remove("hidden");
  console.log(`[SOCKET] Game created, room ID: ${roomId}`);
});

socket.on("game_joined",(data)=>{
  roomId=data.room;
  alert(`Joined room: ${roomId}`);
  console.log(`[SOCKET] Successfully joined room: ${roomId}`);
});
socket.on("player_joined",(data)=>{
  console.log(`[SOCKET] Other player joined: ${data.sid}`);
});
socket.on("player_left",(data)=>{
  console.log(`[SOCKET] Player left: ${data.sid}`);
  alert("The other player has left the room.");
});

// -------------------------
// Status UI
// -------------------------
function updateGameStatus(msg){
  if(gameStatusDisplay) gameStatusDisplay.textContent=msg;
  console.log(`[STATUS] ${msg}`);
}
