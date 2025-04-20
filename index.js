const express = require("express");
const bodyParser = require("body-parser");
const voiceRoutes = require("./routes/voice");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/voice", voiceRoutes);

app.get("/", (req, res) => res.send("Lokma Voice Assistant is running"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
