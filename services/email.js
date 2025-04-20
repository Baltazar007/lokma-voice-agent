const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendSummaryEmail = async (userInput, aiReply) => {
  const mailOptions = {
    from: `"Lokma Assistant" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: "Résumé d'appel - Lokma IA",
    text: `Client a dit : ${userInput}
Réponse IA : ${aiReply}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Résumé envoyé.");
  } catch (error) {
    console.error("Erreur envoi mail :", error);
  }
};

module.exports = { sendSummaryEmail };
