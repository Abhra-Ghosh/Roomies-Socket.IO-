const users = [];

function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);
  console.log(users);

  return user;
}

function getCurrentUser(id) {
  return (index = users.find((user) => user.id === id));
}

function leaveRoom(id) {
  const index = users.findIndex((user) => user.id === id);
  users.splice(index, 1);
  console.log(users);
  //return (ind = users.find((user) => user.id === id));
}

function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  leaveRoom,
  getRoomUsers,
};
