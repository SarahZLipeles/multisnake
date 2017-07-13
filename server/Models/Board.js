

module.exports = class Board {
	constructor() {
		this.table = {};
	}

	addEntity(entity) {
		this.table[entity.coordToString()] = entity;
		return this;
	}

	removeEntity(entity) {
		delete this.table[entity.coordToString()];
		return this;
	}

	addSnake(snake) {
		let currentSegment = snake.head;
		while (currentSegment) {
			this.addEntity(currentSegment, "snake");
			currentSegment = currentSegment.next;
		}
		return this;
	}

	removeSnake(snake) {
		let currentSegment = snake.head;
		while (currentSegment) {
			this.removeEntity(currentSegment);
			currentSegment = currentSegment.next;
		}
		return this;
	}

	coincides(entity) {
		return this.table[entity.coordToString()];
	}
};
