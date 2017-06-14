const Snake = require("./Models/Snake");
const snakes = {};

const socketFunction = io => {
  io.on("connection", socket => {
    socket.broadcast.emit("connected", socket.id);
    snakes[socket.id] = new Snake(socket.id);

    socket.on("init", () => {
      snakes[socket.id] = new Snake(socket.id);
    });

    socket.on("disconnect", () => {
      socket.broadcast.emit("dc", socket.id);
      delete snakes[socket.id];
    });

    socket.on("grow", () => {
      snakes[socket.id].grow();
    });

    socket.on("move", snake => {
      snakes[socket.id].move();
      socket.broadcast.emit("move", socket.id, snake);
    });

    socket.on("turn", direction => {
      snakes[socket.id].turn(direction);
    });
  });
};

module.exports = socketFunction;
