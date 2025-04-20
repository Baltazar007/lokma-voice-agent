const express = require("express");
const { VoiceResponse } = require("twilio").twiml;
const { transcribeSpeech, generateResponse, synthesizeVoice } = require("../services/openai");
const { sendSummaryEmail } = require("../services/email");

const router = express.Router();

router.post("/", async (req, res) => {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    input: "speech",
    action: "/voice/process",
    method: "POST",
    timeout: 5
  });
  gather.say("Bonjour et bienvenue chez Lokma. Comment puis-je vous aider ?");
  res.type("text/xml").send(twiml.toString());
});

router.post("/process", async (req, res) => {
  const speechText = req.body.SpeechResult || "Demande non comprise";

  const aiReply = await generateResponse(speechText);
  await sendSummaryEmail(speechText, aiReply);

  const response = new VoiceResponse();
  response.say(aiReply);
  response.redirect("/voice");

  res.type("text/xml").send(response.toString());
});

module.exports = router;
