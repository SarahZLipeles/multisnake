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
		if (this.players.length > (2 * this.foods.length)) this.addFood();
	}

	playerLeave(playerId) {
		this.board.removeSnake(this.snakes[playerId]);
		delete this.snakes[playerId];
		delete this.playerMoves[playerId];
		this.players.splice(this.players.indexOf(playerId), 1);
		if (this.foods.length * 2 > this.players.length + 1) {
			this.board.removeEntity(this.foods.pop());
		}
	}

	addFood(foodValue = 3) {
		const newFood = new Food(this.safeRange, foodValue);
		makeValidFood(newFood, this.board);
		this.foods.push(newFood);
		this.board.addEntity(newFood);
	}

	ready() {
		for (var i = 0; i < this.players.length; i++) {
			if (!this.playerMoves[this.players[i]].ready) return false;
		}
		return true;
	}

	state() {
		const snakes = {};
		let id;
		for (var i = 0; i < this.players.length; i++) {
			id = this.players[i];
			snakes[id] = this.snakes[id].delink();
		}
		return { snakes, foods: this.foods };
	}

	tick() {
		let currPlayerId, currSnake;
		for (var i = 0; i < this.players.length; i++) {
			currPlayerId = this.players[i];
			currSnake = this.snakes[currPlayerId];
			this.board.removeEntity(currSnake.tail);
			currSnake.turn(this.playerMoves[currPlayerId].move).move();

			// check if out of bounds
			if (outsidePlayArea(currSnake.head, this.playArea)) currSnake.die();

			// collision check
			let check = this.board.coincides(currSnake.head) || {};
			if (check.constructor.name === "Food") {
				currSnake.grow(check.value);
				this.foods.find((food, foodIndex) => {
					if (food === check) {
						const thisFood = this.foods[foodIndex];
						thisFood.die();
						makeValidFood(thisFood, this.board);
						this.board.removeEntity(check).addEntity(thisFood);
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

function outsidePlayArea(entity, playArea) {
	return Math.abs(entity.x) > playArea ||
		Math.abs(entity.y) > playArea ||
		Math.abs(entity.z) > playArea;
}
