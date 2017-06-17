const SnakeSegment = require("./SnakeSegment");

module.exports = class Snake {
	constructor(direction = "x+", range = 0) {
		this.length = 1;
		this.direction = {
			axis: direction[0],
			isNeg: direction[1] === "-"
		};
		this.range = range;
		this.head = new SnakeSegment(Math.floor(Math.random() * (range + range) - range),
			Math.floor(Math.random() * (range + range) - range),
			Math.floor(Math.random() * (range + range) - range));
		this.tail = this.head;
	}

	move() {
		let currSegment = this.tail;
		while (currSegment.prev) {
			currSegment.copyPosition(currSegment.prev);
			currSegment = currSegment.prev;
		}
		this.head[this.direction.axis] += Math.pow(-1, this.direction.isNeg);
	}

	grow() {
		this.length++;
		this.tail = this.tail.clone({ prev: this.tail });
		this.tail.prev.next = this.tail;
	}

	turn(direction) {
		if (direction) {
			this.direction = {
				axis: direction[0],
				isNeg: direction[1] === "-"
			};
		}
	}

	die() {
		this.head = new SnakeSegment(Math.floor(Math.random() * (this.range + this.range) - this.range),
			Math.floor(Math.random() * (this.range + this.range) - this.range),
			Math.floor(Math.random() * (this.range + this.range) - this.range));
		this.tail = this.head;
		this.length = 1;
	}

	collides(entity) {
		let currSegment = this.head;
		while (currSegment) {
			if (entity.coincides(currSegment)) return true;
			currSegment = currSegment.next;
		}
		return false;
	}

	suicides() {
		if (this.length < 5) return false;
		let bunchedUp = true;
		let retVal = false;
		let currSegment = this.head.next.next.next.next;
		while (currSegment) {
			if (this.head.coincides(currSegment)) retVal = true;
			currSegment = currSegment.next;
			if (currSegment && !currSegment.coincides(currSegment.prev)) bunchedUp = false;

		}
		return !bunchedUp && retVal;
	}
};
