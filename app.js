const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from the .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the 'public' folder

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.post("/api/chat", async (req, res) => {
  const prompt = req.body.prompt;

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.CHATGPT_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: prompt,
      max_tokens: 100,
    }),
  };

  try {
    const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", requestOptions);
    const data = await response.json();
    res.json(data.choices[0].text.trim());
  } catch (error) {
    res.status(500).json({ message: "An error occurred while processing the request." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
