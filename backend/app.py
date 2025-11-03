from flask import Flask, send_from_directory

app = Flask(__name__, static_folder="static", static_url_path="/static")

# Serve the main SPA page
@app.route("/")
@app.route("/<path:path>")
def serve(path="index.html"):
    return send_from_directory("static", path)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
