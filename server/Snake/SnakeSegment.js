var Entity = require("./Entity");

module.exports = class SnakeSegment extends Entity {
    constructor (x, y, z, next = null) {
        super(x, y, z);
        this.next = next;
    }
};
