const express = require("express");
const dotenv = require("dotenv");
const conenctDB = require("./config/db");
const app = express();
const colors = require("colors");
const { notFound, errorHandler } = require("./middleware/error-handler");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const path = require("path");
// const cors = require('cors');

// app.use(cors());
dotenv.config();
conenctDB();
app.use(express.json()); // accpet data in json

require("./models/messageModel");

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

///////////////// Deployment
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {

  app.use(express.static(path.join(__dirname1, '/frontend/build')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  })

} else {
  app.get("/", (req, res) => {
    res.send("API is Running Successfully.");
  });
}
///////////////// Deployment

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 4200;
const server = app.listen(PORT, () => {
  console.log(`Chat app is running over ${PORT}`.cyan.underline);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connection");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: ", room);
  });

  socket.on("typing", (room) => {
    socket.in(room).emit("typing");
  });

  socket.on("stop typing", (room) => {
    socket.in(room).emit("stop typing");
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) {
      return console.log("Chat users not defined!!");
    }
    console.log("new message", newMessageRecieved.content);
    chat.users.forEach((user) => {
      if (user._id === newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
      console.log("emiiting new message to other uses");
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
