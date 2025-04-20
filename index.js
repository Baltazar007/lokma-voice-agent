const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const voiceRoutes = require("./routes/voice");
require("dotenv").config();


const PORT = process.env.PORT || 3000;

const mime = require("mime-types");

app.use((req, res, next) => {
  if (req.url.endsWith(".mp3")) {
    res.setHeader("Content-Type", "audio/mpeg");
  }
  next();
});

app.use("/voice", voiceRoutes);
app.use(express.static("public")); // Pour servir output.mp3

app.get("/", (req, res) => res.send("Lokma Voice Assistant is running"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
