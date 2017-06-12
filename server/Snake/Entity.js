module.exports = class Entity {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    copyPosition(entity) {
        this.x = entity.x;
        this.y = entity.y;
        this.z = entity.z;
        return this;
    }

    coincides(entity) {
        return this.x === entity.x && this.y == entity.y && this.x === entity.x;
    }
};

