const express = require("express");
const dotenv = require("dotenv");
const conenctDB = require("./config/db");
const app = express();
const colors = require("colors");
const { notFound, errorHandler } = require("./middleware/error-handler");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
// const cors = require('cors');

// app.use(cors());
dotenv.config();
conenctDB();
app.use(express.json()); // accpet data in json

require("./models/messageModel");

app.get("/", (req, res) => {
  res.send("home ");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Chat app is running over ${PORT}`.cyan.underline);
});
