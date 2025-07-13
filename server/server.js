// server/server.js

const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

// ✅ Serve static files from the Cordova build output (www folder)
app.use(express.static(path.join(__dirname, "../www")));

// ✅ Catch-all route to handle client-side routing (if needed)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../www", "index.html"));
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
