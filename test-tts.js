const { generateSpeech } = require("./services/tts");

(async () => {
    const path = await generateSpeech("Bonjour, je suis Chloé de Lokma. Comment puis-je vous aider ?");
    console.log("Audio path:", path);
})();
