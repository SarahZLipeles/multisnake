const socketFunction = function (io) {
  io.on("connection", function (socket) {
    console.log("got a connection", socket.id);

    socket.broadcast.emit("connection", socket.id);

    socket.on("disconnect", function () {
      socket.broadcast.emit("disconnect", socket.id);
    });

    socket.on("move", function (snake) {
      socket.broadcast.emit("move", socket.id, snake);
    });
  });
};

module.exports = socketFunction;
