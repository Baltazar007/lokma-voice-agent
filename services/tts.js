const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

const generateSpeech = async (text) => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;

    try {
        const response = await axios({
            method: "POST",
            url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
            headers: {
                "xi-api-key": apiKey,
                "Content-Type": "application/json",
                "Accept": "audio/mpeg",
            },
            data: {
                text,
                model_id: "eleven_multilingual_v2",
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.8,
                },
            },
            responseType: "arraybuffer",
        });

        if (response.status !== 200) {
            console.error("❌ Erreur ElevenLabs:", response.statusText);
            return null;
        }

        const filePath = "public/output.mp3";
        fs.writeFileSync(filePath, response.data);
        console.log("✅ Fichier audio généré avec succès !");
        return "https://lokma-voice-agent.onrender.com/output.mp3";


    } catch (error) {
        console.error("❌ Erreur génération audio :", error.message);
        return null;
    }
};

module.exports = { generateSpeech };
