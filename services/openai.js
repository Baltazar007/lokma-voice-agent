require("dotenv").config();
const { OpenAI } = require("openai");


const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateResponse = async (userInput) => {
  const prompt = require("fs").readFileSync("prompt.txt", "utf8");

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
