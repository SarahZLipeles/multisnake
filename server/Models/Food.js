var Entity = require("./Entity");

module.exports = class Food extends Entity {
	constructor(range, value = 1) {
		super(randomPos(range), randomPos(range), randomPos(range));
		this.range = range;
		this.value = value;
	}

	die() {
		this.x = randomPos(this.range);
		this.y = randomPos(this.range);
		this.z = randomPos(this.range);
	}
};

function randomPos(range) {
	return Math.floor(Math.random() * (range + range) - range);
}
