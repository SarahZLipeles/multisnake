var Entity = require("./Entity");

module.exports = class Food extends Entity {
	constructor(range, value = 1) {
		super(Math.floor(Math.random() * (range + range) - range),
			Math.floor(Math.random() * (range + range) - range),
			Math.floor(Math.random() * (range + range) - range));
		this.range = range;
		this.value = value;
	}

	randomPos() {
		return Math.floor(Math.random() * (this.range + this.range) - this.range);
	}

	die() {
		this.x = this.randomPos();
		this.y = this.randomPos();
		this.z = this.randomPos();
	}
};
