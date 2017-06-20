

module.exports = class Board {
	constructor() {
		this.table = {};
	}

	addEntity(entity, value = true) {
		this.table[entity.coordToString()] = entity;
	}

	removeEntity(entity) {
		delete this.table[entity.coordToString()];
	}

	addSnake(snake) {
		let currentSegment = snake.head;
		while (currentSegment) {
			this.addEntity(currentSegment, "snake");
			currentSegment = currentSegment.next;
		}
	}

	removeSnake(snake) {
		let currentSegment = snake.head;
		while (currentSegment) {
			this.removeEntity(currentSegment);
			currentSegment = currentSegment.next;
		}
	}

	coincides(entity) {
		return this.table[entity.coordToString()];
	}
};
