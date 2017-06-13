var Entity = require("./Entity");

module.exports = class Food extends Entity {
    constructor(x, y, z, value = 1) {
        super(x, y, z);
        this.value = value;
    }
};
