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
			game.playerLeave(socket.id);
			socket.broadcast.emit("dc", socket.id);
			if (game.ready()) {
				game.tick();
				let timeSinceLastTick = (new Date()) - ticker;
				setTimeout(() => {
					ticker = new Date();
					io.sockets.emit("state", game.state());
				}, (((timeSinceLastTick >= 0) ? (minimumTimeBetweenTicks - timeSinceLastTick) : (0))));
			}
		});
		let lagout = true;
		socket.on("tick", direction => {
			if (!game.snakes[socket.id]) {
				game.playerJoin(socket.id);
				socket.broadcast.emit("connected", socket.id);
			}
			lagout = false;
			game.playerMoves[socket.id].move = direction;
			game.playerMoves[socket.id].ready = true;
			if (game.ready()) {
				game.tick();
				let timeSinceLastTick = (new Date()) - ticker;
				setTimeout(() => {
					ticker = new Date();
					io.sockets.emit("state", game.state());
					lagout = true;
					setTimeout(() => {
						if (lagout) {
							socket.disconnect("lag out");
              // game.playerLeave(socket.id);
              // socket.broadcast.emit("dc", socket.id);
						}
					}, 2000);
				}, (((timeSinceLastTick >= 0) ? (minimumTimeBetweenTicks - timeSinceLastTick) : (0))));

			}
		});
	});
};

module.exports = socketFunction;
