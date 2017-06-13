var Entity = require("./Entity");

module.exports = class SnakeSegment extends Entity {
    constructor(x, y, z, next = null, prev = null) {
        super(x, y, z);
        this.next = next;
        this.prev = prev;
    }
};
