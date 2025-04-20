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
    action: "/voice/process",
    method: "POST",
    timeout: 5,
  });
  gather.say("Bonjour et bienvenue chez Lokma. Comment puis-je vous aider ?");
  res.type("text/xml").send(twiml.toString());
});

router.post("/process", async (req, res) => {
  const speechText = req.body.SpeechResult || "Demande non comprise";
  const aiReply = await generateResponse(speechText);
  await sendSummaryEmail(speechText, aiReply);

  const audioPath = await generateSpeech(aiReply);

  const twiml = new VoiceResponse();
  if (audioPath) {
    twiml.play(audioPath); // joue le fichier MP3
  } else {
    twiml.say("Je suis désolée, une erreur s’est produite.");
  }
  twiml.redirect("/voice");
  res.type("text/xml").send(twiml.toString());
});

module.exports = router;
