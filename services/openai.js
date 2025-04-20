require("dotenv").config();
const { OpenAI } = require("openai");
const fs = require("fs");
const path = require("path");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateResponse = async (userInput) => {
  const promptPath = path.join(__dirname, "../prompt.txt"); // 🔁 adapt if prompt.txt is elsewhere
  let prompt;

  try {
    prompt = fs.readFileSync(promptPath, "utf8");
  } catch (err) {
    console.error("❌ Erreur de lecture du fichier prompt.txt :", err.message);
    prompt = "Tu es une assistante vocale. Le fichier de prompt est manquant."; // fallback
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: userInput }
    ]
  });

  return completion.choices[0].message.content;
};

module.exports = { generateResponse };
