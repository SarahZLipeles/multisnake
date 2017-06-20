module.exports = class Entity {
	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}

	coordToString() {
		return [this.x, this.y, this.z].join(",");
	}

	copyPosition(entity) {
		if (!entity) return undefined;
		this.x = entity.x;
		this.y = entity.y;
		this.z = entity.z;
		return this;
	}

	coincides(entity) {
		return this.x === entity.x && this.y === entity.y && this.z === entity.z;
	}

	// clones the entity and optionally overwrites properties if an object is passed
	clone(obj) {
		return Object.assign(new this.constructor, this, obj);
	}
};
