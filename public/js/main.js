const socket = io();
const messages = document.getElementById("cmsgs");
const chatform = document.getElementById("chat-form");
const roomName = document.getElementById("roomname");

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(username, room);

socket.emit("joinroom", { username, room });
socket.on("roomUsers", (details) => {
  console.log(details);
  const room = details.room;
  const users = details.currUsers;
  console.log(room, users);
  outputRoomname(room);
  outputUsersname(users);
});

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  messages.scrollTop = messages.scrollHeight;
});

chatform.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = document.getElementById("msg").value;

  socket.emit("chatMessage", msg);

  document.getElementById("msg").value = "";
});

function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class='meta'>${message.username}<span>${message.time}</span></p>
  <p class = 'text'> ${message.text} </p>`;
  //document.querySelector(".chat-messages").appendChild(div);
  document.getElementById("cmsgs").appendChild(div);
}

function outputRoomname(room) {
  document.getElementById("room-name").innerText = room;
}

function outputUsersname(users) {
  document.getElementById("users").innerHTML = `${users
    .map((user) => `<li>${user.username}</li>`)
    .join("")}`;
}
