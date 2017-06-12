module.exports = class Entity {
    constructor(x = 0, y = 0, z = 0) {
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
        return this.x === entity.x && this.y === entity.y && this.z === entity.z;
    }
};
