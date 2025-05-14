// routes/ai.route.js
import express from "express";
import axios from "axios";
import "dotenv/config";
const router = express.Router();

router.post("/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const geminiApiKey = process.env.GEMINI_API_KEY;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const aiText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";

    res.json({ response: aiText });
  } catch (error) {
    console.error("AI Request Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to get AI response." });
  }
});

export default router;
