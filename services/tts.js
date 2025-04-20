const axios = require("axios");
const fs = require("fs");
const path = require("path");

require("dotenv").config(); // important s’il n’y est pas
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

console.log("🔑 ELEVENLABS_API_KEY:", ELEVENLABS_API_KEY ? "OK" : "❌ MISSING");
console.log("🎤 VOICE_ID:", VOICE_ID || "❌ MISSING");


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
                responseType: "arraybuffer", // <-- Important pour recevoir le fichier audio
                headers: {
                    "xi-api-key": ELEVENLABS_API_KEY,
                    "Content-Type": "application/json",
                    Accept: "audio/mpeg", // <-- important aussi
                },
            }
        );

        // 🟢 Sauvegarde du fichier dans /public/output.mp3
        fs.writeFileSync(outputFile, response.data);
        console.log("✅ Fichier audio généré avec succès !");
        return "https://lokma-voice-agent.onrender.com/output.mp3";

    } catch (error) {
        console.error("❌ Erreur génération audio :", error.message);
        return null;
    }
}


module.exports = { generateSpeech };
