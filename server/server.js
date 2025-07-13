const express = require("express");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;

// Serve the static Cordova files from the sibling 'www' directory
app.use(express.static(path.join(__dirname, "..", "www")));

// Catch-all fallback to index.html for SPA routing support
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "www", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
