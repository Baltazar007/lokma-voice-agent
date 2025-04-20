require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // false = TLS (587), true = SSL (465)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const mailOptions = {
    from: `"Lokma Voice Test" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO, // s’envoie à soi-même
    subject: "Test d’envoi de mail depuis Lokma",
    text: "Ceci est un test d’envoi de mail automatique via Nodemailer.",
};

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.error("❌ Erreur envoi mail :", error);
    } else {
        console.log("✅ Email envoyé avec succès :", info.response);
    }
});
