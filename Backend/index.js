const app = require("./app");
const mongoose = require("mongoose");
const socket = require("socket.io");
require("dotenv").config();
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successfully");
  })
  .catch((error) => {
    console.log("error", error.message);
  });

const server = app.listen(5000);
const io = socket(server, {
  cors: "http://localhost:3000",
  credentials: true,
});
global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => onlineUsers.set(userId, socket.id));
  socket.on("send-msg", (data) => {
    const sendSocketUser = onlineUsers.get(data.to);

    if (sendSocketUser) {
      socket.to(sendSocketUser).emit("msg-receive", data.msg);
    }
  });
});
