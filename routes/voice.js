const express = require("express");
const { VoiceResponse } = require("twilio").twiml;
const { generateResponse } = require("../services/openai");
const { sendSummaryEmail } = require("../services/email");
const { generateSpeech } = require("../services/tts");

const router = express.Router();

// Route d’accueil vocale : lance le prompt initial
router.post("/", async (req, res) => {
  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    input: "speech",
    action: "https://lokma-voice-agent.onrender.com/voice/process", // ⚠️ URL ABSOLUE
    method: "POST",
    timeout: 5,
  });

  gather.say("Bonjour et bienvenue chez Lokma. Comment puis-je vous aider ?");

  // Twilio attend un XML
  res.type("text/xml").send(twiml.toString());
});

// Route appelée après que l'utilisateur a parlé
router.post("/process", async (req, res) => {
  const speechText = req.body.SpeechResult || "Demande non comprise";
  console.log("📞 Voix utilisateur :", speechText);

  const aiReply = await generateResponse(speechText);
  console.log("🤖 Réponse IA :", aiReply);

  await sendSummaryEmail(speechText, aiReply);

  const audioPath = await generateSpeech(aiReply);
  console.log("🎧 Lien audio envoyé à Twilio :", audioPath);

  const twiml = new VoiceResponse();

  if (audioPath) {
    twiml.play(audioPath); // voix naturelle ElevenLabs
  } else {
    twiml.say(aiReply); // fallback robot
  }

  // Boucle vers /voice pour continuer la conversation
  twiml.redirect("https://lokma-voice-agent.onrender.com/voice");

  res.type("text/xml").send(twiml.toString());
});

module.exports = router;
