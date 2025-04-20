const axios = require("axios");
const fs = require("fs");
const path = require("path");

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID; // ID de la voix personnalisée

const outputFile = path.join(__dirname, "..", "public", "output.mp3");

async function generateSpeech(text) {
    try {
        const response = await axios.post(
            `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
            {
                text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.3,
                    similarity_boost: 0.8,
                },
            },
            {
                headers: {
                    "xi-api-key": ELEVENLABS_API_KEY,
                    "Content-Type": "application/json",
                },
                responseType: "arraybuffer",
            }
        );

        fs.writeFileSync(outputFile, response.data);
        return "/output.mp3"; // chemin public utilisé par Twilio
    } catch (error) {
        console.error("Erreur génération audio :", error.message);
        return null;
    }
}

module.exports = { generateSpeech };
