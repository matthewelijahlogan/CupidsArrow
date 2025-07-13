const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the www directory
app.use(express.static(path.join(__dirname, "../www")));

// Fallback for single-page routing
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../www", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
