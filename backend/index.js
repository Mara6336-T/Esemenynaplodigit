const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend" });
});