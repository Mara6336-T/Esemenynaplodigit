const express = require("express");
const app = express();
const cors = require("cors");
const puppeteer = require("puppeteer");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});




// ✅ NEW ROUTE
app.post("/generate-pdf", async (req, res) => {
  try {
    const { html } = req.body;

    if (!html) {
      return res.status(400).send("Missing HTML content");
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html, { waitUntil: "networkidle0" });

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

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
// app.get("/api/hello", (req, res) => {
//   res.json({ message: "Hello from backend" });
// });