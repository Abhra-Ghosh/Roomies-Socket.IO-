const express = require("express");
const path = require("path");
const http = require("http");
const {
  userJoin,
  getCurrentUser,
  leaveRoom,
  getRoomUsers,
} = require("./utils/users");
const app = express();
const formatMessage = require("./utils/message");
app.use(express.static(path.join(__dirname, "public")));
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
const name = "Roomie Bot  ";

// app.get("http://localhost:3000/chat.html", (req, res) => {
//   console.log(req);
// });

io.on("connection", (socket) => {
  console.log("new ws connection");

  socket.on("joinroom", (userDetails) => {
    //console.log(username);
    const user = userJoin(socket.id, userDetails.username, userDetails.room);

    socket.join(user.room);

    socket.emit("message", formatMessage(name, "Welcome to Roomies"));

    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(name, `${user.username} has joined the chat`)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      currUsers: getRoomUsers(user.room),
    });
  });

  socket.on("disconnect", () => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit(
      "message",
      formatMessage(name, `${user.username} has left the chat`)
    );
    leaveRoom(socket.id);

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      currUsers: getRoomUsers(user.room),
    });
  });

  socket.on("chatMessage", (msg) => {
    //console.log(msg);
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
});

server.listen(3000, () => {
  //console.log("");
  console.log("server running on port 3000");
});
