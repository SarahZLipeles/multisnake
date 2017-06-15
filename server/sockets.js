// const Snake = require("./Models/Snake");
const Game = require("./Game.js");

const game = new Game();

const minimumTimeBetweenTicks = 66;

const socketFunction = io => {
  let ticker = new Date();
  io.on("connection", socket => {
    socket.broadcast.emit("connected", socket.id);

    game.playerJoin(socket.id);

    socket.on("disconnect", () => {
      socket.broadcast.emit("dc", socket.id);
      game.playerLeave(socket.id);
    });

    socket.on("tick", direction => {
      game.playerMoves[socket.id].move = direction;
      game.playerMoves[socket.id].ready = true;
      if (game.ready()) {
        game.tick();
        let timeSinceLastTick = (new Date()) - ticker;
        setTimeout(() => {
          ticker = new Date();
          io.sockets.emit("state", game.state());
        }, (((timeSinceLastTick >= 0) ? (minimumTimeBetweenTicks - timeSinceLastTick) : (0))));

      }
    });
  });
};

module.exports = socketFunction;
