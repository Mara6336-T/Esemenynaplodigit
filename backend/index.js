const express = require("express");
const app = express();
const cors = require("cors");
const puppeteer = require("puppeteer");

const matchesData = require("./mock-data/matches.json");

const MOCK_API_KEY = "mock-mlsz-key";

app.use(cors());
app.use(express.json());


// =========================
// Basic test route
// =========================

app.get("/", (req, res) => {
  res.send("Backend is running");
});


// =========================
// MOCK MLSZ API
// =========================

app.get("/api/mlsz/matches", (req, res) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== MOCK_API_KEY) {
    return res.status(401).json({
      error: "Invalid API key"
    });
  }

  const { teamId } = req.query;

  let matches = matchesData.matches;

  if (teamId) {
    matches = matches.filter(
      match => match.teamId === Number(teamId)
    );
  }

  res.json({
    matches
  });
});


app.get("/api/mlsz/matches/:id", (req, res) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== MOCK_API_KEY) {
    return res.status(401).json({
      error: "Invalid API key"
    });
  }

  const matchId = Number(req.params.id);

  const match = matchesData.matches.find(
    match => match.id === matchId
  );

  if (!match) {
    return res.status(404).json({
      error: "Match not found"
    });
  }

  if (match.status === "cancelled") {
    error: "Match cancelled még meg kell csinálni hogy az archivumban benne legyen "
  }

  if (match.status === "ended") {
    //finalizálni kell
  }

  res.json(match);
});


// =========================
// PDF GENERATION
// =========================

app.post("/generate-pdf", async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).send("Missing HTML content");
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0"
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=file.pdf",
    });

    res.send(pdf);

  } catch (err) {
    console.error(err);
    res.status(500).send("PDF generation failed");
  }
});


// =========================
// START SERVER
// =========================

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
