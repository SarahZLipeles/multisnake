var Entity = require("./Entity");

module.exports = class Food extends Entity {
    constructor(range, value = 1) {
        super(Math.floor(Math.random() * (range + range) - range),
        Math.floor(Math.random() * (range + range) - range),
        Math.floor(Math.random() * (range + range) - range));
        this.value = value;
    }
};
