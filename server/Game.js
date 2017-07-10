const models = require("./Models");
const Snake = models.Snake;
const Food = models.Food;
const Board = models.Board;

module.exports = class Game {
	constructor(size = 100) {
		this.snakes = {};
		this.players = [];
		this.playerMoves = {};
		this.foods = [];
		this.size = size;
		this.playArea = (this.size / 2);
		this.safeRange = Math.floor(this.playArea * 0.9);
		this.board = new Board();
	}

	playerJoin(playerId) {
		this.snakes[playerId] = new Snake("x+", this.safeRange);
		this.board.addSnake(this.snakes[playerId]);
		this.players.push(playerId);
		this.playerMoves[playerId] = { move: "", ready: false };
		if (this.players.length > (2 * this.foods.length)) {
			const newFood = new Food(this.safeRange, 3);
			makeValidFood(newFood, this.board);
			this.foods.push(newFood);
			this.board.addEntity(newFood, "food");
		}
	}

	playerLeave(playerId) {
		this.board.removeSnake(this.snakes[playerId]);
		delete this.snakes[playerId];
		delete this.playerMoves[playerId];
		this.players.splice(this.players.indexOf(playerId), 1);
		if (this.foods.length * 2 > this.players.length + 1) {
			const removedFood = this.foods.pop();
			this.board.removeEntity(removedFood);
		}
	}

	ready() {
		for (var i = 0; i < this.players.length; i++) {
			if (!this.playerMoves[this.players[i]].ready) return false;
		}
		return true;
	}

	state() {
		const newSnake = {};
		let currentSegment, id;
		for (let i = 0; i < this.players.length; i++) {
			id = this.players[i];
			newSnake[id] = [];
			currentSegment = this.snakes[id].head;
			while (currentSegment) {
				newSnake[id].push({
					x: currentSegment.x,
					y: currentSegment.y,
					z: currentSegment.z
				});
				currentSegment = currentSegment.next;
			}
		}
		return { snakes: newSnake, foods: this.foods };
	}

	tick() {
		let currPlayerId, currSnake;
		for (let i = 0; i < this.players.length; i++) {
			currPlayerId = this.players[i];
			currSnake = this.snakes[currPlayerId];
			currSnake.turn(this.playerMoves[currPlayerId].move);
			this.board.removeEntity(currSnake.tail);
			currSnake.move();

			// check if out of bounds
			if (Math.abs(currSnake.head.x) > this.playArea ||
				Math.abs(currSnake.head.y) > this.playArea ||
				Math.abs(currSnake.head.z) > this.playArea) {
				currSnake.die();
			}

			// collision check
			let check = this.board.coincides(currSnake.head) || {};
			if (check.constructor.name === "Food") {
				for (let k = 0; k < check.value; k++) {
					currSnake.grow();
				}
				this.foods.find((food, foodIndex) => {
					if (food === check) {
						this.foods[foodIndex].die();
						makeValidFood(this.foods[foodIndex], this.board);
						this.board.removeEntity(check);
						this.board.addEntity(this.foods[foodIndex], "food");
					}
				});
			} else if (check.constructor.name === "SnakeSegment" || currSnake.suicides()) {
				this.board.removeSnake(currSnake);
				currSnake.die();
			}

			this.board.addEntity(currSnake.head);
			this.playerMoves[currPlayerId].ready = false;
		}
	}
};

function makeValidFood(food, board) {
	while (board.coincides(food)) {
		food.die();
	}
}
