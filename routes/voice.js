const express = require("express");
const { VoiceResponse } = require("twilio").twiml;
const { generateResponse } = require("../services/openai");
const { sendSummaryEmail } = require("../services/email");
const { generateSpeech } = require("../services/tts");

const router = express.Router();

router.post("/", async (req, res) => {
  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    input: "speech",
    action: "https://lokma-voice-agent.onrender.com/voice/process",
    method: "POST",
    timeout: 5,
  });

  gather.say("Bonjour et bienvenue chez Lokma. Comment puis-je vous aider ?");
  res.type("text/xml").send(twiml.toString());
});

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
    twiml.pause({ length: 1 }); // Ajoute un délai
    twiml.play("https://lokma-voice-agent.onrender.com/output.mp3");
  } else {
    twiml.say(aiReply);
  }

  twiml.redirect("https://lokma-voice-agent.onrender.com/voice");
  res.type("text/xml").send(twiml.toString());
});

module.exports = router;
