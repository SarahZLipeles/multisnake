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
		this.tail.copyPosition(this.head);
		this.tail[this.direction.axis] += Math.pow(-1, this.direction.isNeg);
		this.tail.next = this.head;
		this.head.prev = this.tail;
		this.tail = this.tail.prev;
		this.tail.next = null;
		this.head = this.head.prev;
		this.head.prev = null;
		return this;
	}

	delink() {
		const delinkedSnake = [];
		let currentSegment = this.head;
		while (currentSegment) {
			delinkedSnake.push({
				x: currentSegment.x,
				y: currentSegment.y,
				z: currentSegment.z
			});
			currentSegment = currentSegment.next;
		}
		return delinkedSnake;
	}

	grow(times = 1) {
		if (times < 0) throw (new Error("negative growth number"));
		this.length++;
		this.tail = this.tail.clone({ prev: this.tail });
		this.tail.prev.next = this.tail;
		return times > 1 ? this.grow(times - 1) : this;
	}

	turn(direction) {
		if (direction) {
			this.direction = {
				axis: direction[0],
				isNeg: direction[1] === "-"
			};
		}
		return this;
	}

	die() {
		this.head = new SnakeSegment(Math.floor(Math.random() * (this.range + this.range) - this.range),
			Math.floor(Math.random() * (this.range + this.range) - this.range),
			Math.floor(Math.random() * (this.range + this.range) - this.range));
		this.tail = this.head;
		this.length = 1;
		return this;
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
