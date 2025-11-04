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
# Make sure eventlet is installed: pip install eventlet
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet", ping_timeout=60, ping_interval=25)

# ------------------------
# In-memory Game State
# ------------------------
games = {}  # {room_id: {"users": [sid1, sid2], "state": {}, "last_active": timestamp}}

# ------------------------
# Tasks per Stage (shortened example)
# ------------------------
tasksByStage = {
    1: [
        {"title": "Early Tease", "description": "Send a subtle hint.", "image": "img/text1.jpg"},
        {"title": "Memory Spark", "description": "Text them about a spicy memory.", "image": "img/text2.jpg"}
    ],
    2: [
        {"title": "Slow Striptease", "description": "Do a playful striptease.", "image": "img/tease1.jpg"},
        {"title": "Lap Dance Tease", "description": "Give a teasing lap dance.", "image": "img/tease3.jpg"}
    ],
    3: [
        {"title": "Plumber", "description": "He stands over her.", "image": "img/FellacioPositions/plumber.png"},
        {"title": "Snake Charmer", "description": "She kneels charming the snake.", "image": "img/FellacioPositions/snake_charmer.png"}
    ],
    4: [
        {"title": "Missionary", "description": "Classic, intimate.", "image": "img/positions/missionary.png"},
        {"title": "Cowgirl", "description": "Partner on top, riding with control.", "image": "img/positions/cowgirl.png"}
    ]
}

# ------------------------
# Routes
# ------------------------
@app.route("/", defaults={"path": "index.html"})
@app.route("/<path:path>")
def serve(path):
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
    # eventlet handles WebSockets properly
    socketio.run(app, host="0.0.0.0", port=port)
