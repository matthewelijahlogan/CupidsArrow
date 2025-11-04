# app.py
import os
import uuid
import random
import time
from flask import Flask, send_from_directory, request, jsonify
from flask_socketio import SocketIO, join_room, leave_room, emit

# ------------------------
# Flask + SocketIO Setup
# ------------------------
app = Flask(__name__, static_folder="static")
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet", ping_timeout=60, ping_interval=25)

# ------------------------
# In-memory Game State
# ------------------------
games = {}  # {room_id: {"users": [sid1, sid2], "state": {}, "last_active": timestamp}}

# ------------------------
# Tasks per Stage
# (full list simplified for brevity; replicate as needed)
# ------------------------
tasksByStage = {
  1: [
    { "title": "Early Tease",           "description": "Send a subtle hint about tonight without giving too much away.", "image": "img/text1.jpg" },
    { "title": "Memory Spark",          "description": "Text them about a spicy memory you both loved.",                 "image": "img/text2.jpg" },
    { "title": "Countdown Message",     "description": "Let them know you’re counting the hours until you’re together.", "image": "img/text3.jpg" },
    { "title": "What Are You Wearing?", "description": "Playfully ask what they’re wearing (with a wink).",              "image": "img/text4.jpg" },
    { "title": "Can’t Wait",            "description": "Tell them you’ve been thinking about them *all* day.",          "image": "img/text5.jpg" },
    { "title": "Secret Plan",           "description": "Hint at a surprise you’re planning for tonight.",                "image": "img/text6.jpg" },
    { "title": "You + Me = 🔥",         "description": "Send a flirty equation or emoji combo.",                         "image": "img/text7.jpg" },
    { "title": "Lunch Break Lust",      "description": "Text something hot right before their lunch break.",             "image": "img/text8.jpg" },
    { "title": "Voice Drop",            "description": "Send a short, sexy voice note saying how much you miss them.",  "image": "img/text9.jpg" },
    { "title": "Code Word",             "description": "Create a fun little code word for ‘I want you’.",               "image": "img/text10.jpg" },
    { "title": "Roleplay Hint",         "description": "Send a text in character like a flirty game’s just begun.",     "image": "img/text11.jpg" },
    { "title": "Mystery Photo",         "description": "Send a cropped pic and make them guess what it is.",            "image": "img/text12.jpg" },
    { "title": "Mood Check",            "description": "Ask them to rate their current mood from 💤 to 🔥.",             "image": "img/text13.jpg" },
    { "title": "Text Striptease",       "description": "Describe (in text) what you’re slowly taking off.",             "image": "img/text14.jpg" },
    { "title": "Spoil You Later",       "description": "Tell them one thing you’re going to do to spoil them tonight.", "image": "img/text15.jpg" },
    { "title": "I Dare You",            "description": "Send a mild dare, like ‘Text me what you’d do if I were there.’","image": "img/text16.jpg" },
    { "title": "Emoji Story",           "description": "Send a flirty story using only emojis and make them decode it.", "image": "img/text17.jpg" },
    { "title": "Tonight’s Theme",       "description": "Name a fun or sexy ‘theme’ for the night ahead.",                "image": "img/text18.jpg" },
    { "title": "Text Me When You’re Free", "description": "Build anticipation by asking for a dedicated moment later.", "image": "img/text19.jpg" },
    { "title": "Preview Line",          "description": "Send just *one line* of something you’ll say later in bed.",    "image": "img/text20.jpg" },
    { "title": "Your Turn",             "description": "Send something spicy and tell them it’s their turn to reply.",  "image": "img/text21.jpg" },
    { "title": "Flirty 5-Word Text",    "description": "Challenge yourself to seduce in just five words.",              "image": "img/text22.jpg" },
    { "title": "Fantasy Hint",          "description": "Drop a vague hint about a fantasy you’ve been thinking about.", "image": "img/text23.jpg" },
    { "title": "GIF Duel",              "description": "Start a romantic or sexy GIF war.",                             "image": "img/text24.jpg" },
    { "title": "Linger a Little",       "description": "Say something that will stay on their mind all day.",           "image": "img/text25.jpg" }
    ],
  2: [
    { "title": "Slow Striptease",       "description": "Do a slow, playful striptease while keeping eye contact.",         "image": "img/tease1.jpg" },
    { "title": "Kiss Trail",            "description": "Kiss them softly from their neck to their belly.",                  "image": "img/tease2.jpg" },
    { "title": "Lap Dance Tease",       "description": "Give a lap dance with just enough touch to drive them wild.",       "image": "img/tease3.jpg" },
    { "title": "Whisper Game",          "description": "Whisper something dirty or sweet in their ear—make them shiver.",  "image": "img/tease4.jpg" },
    { "title": "Light Fingertips",      "description": "Run your fingertips over their arms, neck, and chest lightly.",     "image": "img/tease5.jpg" },
    { "title": "Dance Close",           "description": "Put on a slow song and dance close, hips touching.",                "image": "img/tease6.jpg" },
    { "title": "Clothing Tease",        "description": "Pull at their clothing like you're about to undress them… but don’t.", "image": "img/tease7.jpg" },
    { "title": "Pinned Kiss",           "description": "Gently pin them against a wall and kiss them slowly.",              "image": "img/tease8.jpg" },
    { "title": "Blindfold Tease",       "description": "Blindfold them and kiss different spots—make them guess where.",    "image": "img/tease9.jpg" },
    { "title": "Hair Tug",              "description": "Run your hands through their hair and gently tug while kissing.",   "image": "img/tease10.jpg" },
    { "title": "Straddle & Stare",      "description": "Straddle them fully clothed and just stare into their eyes.",       "image": "img/tease11.jpg" },
    { "title": "Body Massage",          "description": "Give them a soft massage that slowly gets more intimate.",          "image": "img/tease12.jpg" },
    { "title": "Clothes-On Makeout",    "description": "Make out passionately but keep all your clothes on.",               "image": "img/tease13.jpg" },
    { "title": "Take Control",          "description": "Lightly push them onto the bed or couch, then hover above.",        "image": "img/tease14.jpg" },
    { "title": "Lip Bite",              "description": "Bite their lip gently during a long kiss.",                         "image": "img/tease15.jpg" },
    { "title": "Ice Cube Tease",        "description": "Trace an ice cube over their neck or stomach.",                     "image": "img/tease16.jpg" },
    { "title": "Tension Build",         "description": "Tease them for 2 minutes—no kissing allowed.",                      "image": "img/tease17.jpg" },
    { "title": "Breath on Skin",        "description": "Hover your mouth over their skin and breathe slowly—no touch.",     "image": "img/tease18.jpg" },
    { "title": "Smirk & Walk Away",     "description": "Say something dirty… then walk away.",                              "image": "img/tease19.jpg" },
    { "title": "Unzip Me",              "description": "Let them unzip your top—slowly—while you kiss them.",               "image": "img/tease20.jpg" },
    { "title": "Touch Only",            "description": "Use only your hands to turn them on—no kissing.",                   "image": "img/tease21.jpg" },
    { "title": "Dirty Whisper",         "description": "Whisper what you’re going to do to them tonight.",                  "image": "img/tease22.jpg" },
    { "title": "Hold Their Hands",      "description": "Hold their wrists gently while you kiss them everywhere else.",     "image": "img/tease23.jpg" },
    { "title": "Just One Kiss",         "description": "Give them one deep kiss, then back away and smile.",                "image": "img/tease24.jpg" },
    { "title": "Slow Crawl",            "description": "Crawl toward them slowly and let your eyes say it all.",            "image": "img/tease25.jpg" }
  ],
  3: [
    { "title": "Plumber",         
      "description": "He stands over her while she rests her head on the edge of the bed.", 
      "image": "img/FellacioPositions/plumber.png"
    },
    { "title": "Fire Hydrant",
      "description": "Relaxed doggy position with full access. Perfect for deep oral.",
      "image": "img/FellacioPositions/fire_hydrant.png"
    },
    { "title": "Guillotine",
      "description": "With legs in hand he straddles her face.",
      "image": "img/FellacioPositions/guillotine.png"
    },
    { "title": "Snake Charmer",
      "description": "He sits on chair while she kneels in front charming the snake.",
      "image": "img/FellacioPositions/snake_charmer.png"
    },  
    { "title": "Face Sitting",
      "description": "Straddle their face and take control of the rhythm.",
      "image": "img/FellacioPositions/face_sitting.png"
    },
    { "title": "Edge of Bed",
      "description": "Lie back on the edge while they kneel — wide access.",
      "image": "img/FellacioPositions/edge_of_bed.png"
    },
    { "title": "Virgo",
      "description": "She stands legs split while he kneels under her.",
      "image": "img/FellacioPositions/virgo.png"
    },
    { "title": "Car Mechanic",
      "description": "He lies on the edge of the bed while she towers over him legs spread.",
      "image":"img/FellacioPositions/car_mechanic.png"
    },
    { "title": "69",
      "description": "A classic she lies on top and enjoy one another.",
      "image":"img/FellacioPositions/69.png"
    },
    { "title": "Bermuda Triangle",
      "description": "She straddles his face standing while she bends over to return the favor.",
      "image":"img/FellacioPositions/Bermuda_Triangle.png"
    },

  ],
  4: [
    {
      "title": "Missionary",
      "description": "A classic and intimate face-to-face position. Great for eye contact and closeness.",
      "image": "img/positions/missionary.png"
    },
    {
      "title": "Cowgirl",
      "description": "Partner on top, riding with control. Perfect for letting them set the pace.",
      "image": "img/positions/cowgirl.png"
    },
    {
      "title": "Reverse Cowgirl",
      "description": "Back turned, facing away, offering a unique visual and feel.",
      "image": "img/positions/reverse_cowgirl.png"
    },
    {
      "title": "Doggy Style",
      "description": "From behind with strong rhythm. Deep and primal.",
      "image": "img/positions/doggy_style.png"
    },
    {
      "title": "Spooning",
      "description": "Lying on the side for gentle, lazy passion.",
      "image": "img/positions/spooning.png"
    },
    {
      "title": "Standing",
      "description": "Great for adventurous quickies or shower play.",
      "image": "img/positions/standing.png"
    },
    {
      "title": "Seated",
      "description": "Lap straddling in a chair. Cozy and sensual.",
      "image": "img/positions/seated.png"
    },
    {
      "title": "Lap Dance",
      "description": "Teasing grind before sliding into a deep connection.",
      "image": "img/positions/lap_dance.png"
    },
    {
      "title": "Side-by-side",
      "description": "Both lying down, intimate and soft.",
      "image": "img/positions/side_by_side.png"
    },
    {
      "title": "The Lotus",
      "description": "Cross-legged embrace — emotionally and physically connected.",
      "image": "img/positions/lotus.png"
    },
    {
      "title": "Butterfly",
      "description": "Partner lies on their back at the edge of a surface while the other stands or kneels — perfect for deep angles.",
      "image": "img/positions/butterfly.png"
    },
    {
      "title": "Bridge",
      "description": "One partner forms a bridge by arching their back while the other enters from above. Demanding but rewarding.",
      "image": "img/positions/bridge.png"
    },
    {
      "title": "Flatiron",
      "description": "One lies flat with legs together while the other enters from behind — deep and intense.",
      "image": "img/positions/flatiron.png"
    },
    {
      "title": "Piledriver",
      "description": "Intense and acrobatic — one partner lies with legs up and back while the other penetrates downward.",
      "image": "img/positions/piledriver.png"
    },
    {
      "title": "Crab",
      "description": "One partner sits with arms behind and hips lifted, the other mounts from the front or back.",
      "image": "img/positions/crab.png"
    },
    {
      "title": "Lazy Dog",
      "description": "Similar to doggy style, but both partners are on their knees and forearms for a more relaxed version.",
      "image": "img/positions/lazy_dog.png"
    },
    {
      "title": "Standing Wheelbarrow",
      "description": "One partner holds the other's legs mid-air while they support themselves on their arms. Athletic and adventurous.",
      "image": "img/positions/standing_wheelbarrow.png"
    },
    {
      "title": "Corkscrew",
      "description": "Lying on the side with one leg elevated and twisted — fantastic for hitting new angles.",
      "image": "img/positions/corkscrew.png"
    },
    {
      "title": "Full Nelson",
      "description": "Put her in a full nelson and have your way with her.",
      "image": "img/positions/FullNelson.png"
    }
  ]
}

# ------------------------
# Routes
# ------------------------
@app.route("/")
@app.route("/<path:path>")
def serve(path="index.html"):
    file_path = os.path.join(app.static_folder, path)
    if os.path.exists(file_path):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")

@app.route("/health")
def health_check():
    return jsonify({"status": "ok", "rooms": len(games)}), 200

# ------------------------
# Utilities
# ------------------------
def cleanup_rooms():
    now = time.time()
    expired = [rid for rid, g in games.items() if (now - g.get("last_active", now)) > 3600 or not g["users"]]
    for rid in expired:
        del games[rid]
        print(f"[CLEANUP] Removed inactive room {rid}")

# ------------------------
# SocketIO Events
# ------------------------
@socketio.on("connect")
def handle_connect():
    print(f"[CONNECT] {request.sid} connected")

@socketio.on("disconnect")
def handle_disconnect():
    sid = request.sid
    print(f"[DISCONNECT] {sid}")
    for room_id, game in list(games.items()):
        if sid in game["users"]:
            game["users"].remove(sid)
            emit("player_left", {"sid": sid}, to=room_id)
            if not game["users"]:
                del games[room_id]
                print(f"[CLEANUP] Room {room_id} deleted (empty)")
    cleanup_rooms()

@socketio.on("create_game")
def handle_create_game():
    room_id = str(uuid.uuid4())[:8]
    games[room_id] = {"users": [request.sid], "state": {}, "last_active": time.time()}
    join_room(room_id)
    emit("game_created", {"room": room_id}, to=request.sid)
    print(f"[CREATE] Room {room_id} created by {request.sid}")

@socketio.on("join_game")
def handle_join_game(data):
    room_id = data.get("room")
    if not room_id:
        emit("error", {"msg": "No room code provided"}, to=request.sid)
        return
    if room_id in games and len(games[room_id]["users"]) < 2:
        join_room(room_id)
        games[room_id]["users"].append(request.sid)
        games[room_id]["last_active"] = time.time()
        emit("game_joined", {"room": room_id}, to=request.sid)
        emit("player_joined", {"sid": request.sid}, to=room_id)
        emit("state_update", {"state": games[room_id]["state"]}, to=request.sid)
        print(f"[JOIN] {request.sid} joined room {room_id}")
    else:
        emit("error", {"msg": "Room full or does not exist"}, to=request.sid)
        print(f"[JOIN-FAIL] {request.sid} failed to join {room_id}")

@socketio.on("spin_task")
def handle_spin_task(data):
    room_id = data.get("room")
    stage_id = data.get("stage")
    if not room_id or not stage_id:
        emit("error", {"msg": "Invalid room or stage data"}, to=request.sid)
        return
    try:
        stage_num = int(stage_id.replace("stage", ""))
    except ValueError:
        emit("error", {"msg": f"Invalid stage format: {stage_id}"}, to=request.sid)
        return

    if room_id in games and stage_num in tasksByStage:
        task = random.choice(tasksByStage[stage_num])
        games[room_id]["state"][stage_id] = task
        games[room_id]["last_active"] = time.time()
        emit("update_task", {"stageId": stage_id, "task": task}, to=room_id)
        print(f"[TASK] {stage_id} → {task['title']} in room {room_id}")
    else:
        emit("error", {"msg": "Stage not found"}, to=request.sid)

@socketio.on("update_state")
def handle_update_state(data):
    room_id = data.get("room")
    state = data.get("state")
    if room_id in games:
        games[room_id]["state"] = state
        games[room_id]["last_active"] = time.time()
        emit("state_update", {"state": state}, to=room_id)
        print(f"[STATE] Room {room_id} updated")

# ------------------------
# Main Entry
# ------------------------
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[START] Cupid's Arrow server running on port {port}")
    socketio.run(app, host="0.0.0.0", port=port)
