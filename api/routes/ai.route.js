import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.OPENAI_API_KEY, // from .env
});

// Helper function for all AI tasks
async function askHF(prompt) {
  const completion = await client.chat.completions.create({
    model: "meta-llama/Llama-3.1-8B-Instruct:scaleway",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 500,
  });

  return completion.choices[0].message.content;
}

/* --------------------
   GRAMMAR CORRECTION
-------------------- */
router.post("/correct", async (req, res) => {
  const { text } = req.body;

  try {
    const html = await askHF(`
Rewrite the following text with perfect grammar, clarity, and flow.
Return ONLY valid HTML using <p>, <br>, <strong>, <em>.

Text:
${text}
    `);

    res.json({ corrected: html });
  } catch (err) {
    res.status(500).json({ error: "Grammar correction failed" });
  }
});

/* --------------------
   OUTLINE GENERATOR
-------------------- */
router.post("/outline", async (req, res) => {
  const { topic } = req.body;

  try {
    const html = await askHF(`
Create a detailed blog post outline for the topic "${topic}".
Return ONLY valid HTML using:

<h2> for main heading
<h3> for subheadings
<ul>, <li> for lists
<p> for descriptions

NO markdown allowed.
  `);

    res.json({ outline: html });
  } catch (err) {
    res.status(500).json({ error: "Outline generation failed" });
  }
});

/* --------------------
   SEO KEYWORDS
-------------------- */
router.post("/seo-keywords", async (req, res) => {
  const { topic } = req.body;

  try {
    const html = await askHF(`
Generate 20 SEO keywords for "${topic}".
Return ONLY valid HTML list format:

<ul>
  <li>keyword</li>
</ul>
    `);

    res.json({ keywords: html });
  } catch (err) {
    res.status(500).json({ error: "Keyword generation failed" });
  }
});

/* --------------------
   TITLE GENERATOR
-------------------- */
router.post("/title", async (req, res) => {
  const { topic } = req.body;

  try {
    const html = await askHF(`
Create 10 engaging blog titles for "${topic}".
Return ONLY this HTML structure:

<ul>
  <li>Title 1</li>
  <li>Title 2</li>
</ul>
    `);

    res.json({ title: html });
  } catch (err) {
    res.status(500).json({ error: "Title generation failed" });
  }
});

export default router;
