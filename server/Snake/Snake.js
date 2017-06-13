const Entity = require("./Entity");
const SnakeSegment = require("./SnakeSegment");

module.exports = class Snake {
    constructor(id, direction = "x+") {
        this.id = id;
        this.length = 1;
        this.direction = {
            axis: direction[0],
            isNeg: direction[1] === "-"
        };
        this.head = new SnakeSegment();
    }

    move() {
        const oldTemp = new Entity().copyPosition(this.head);
        const newTemp = new Entity().copyPosition(this.head.next);
        let currSegment = this.head.next;
        while (currSegment) {
            currSegment.copyPosition(oldTemp);
            oldTemp.copyPosition(newTemp);
            newTemp.copyPosition(currSegment.next);
            currSegment = currSegment.next;
        }
        this.head[this.direction.axis] += Math.pow(-1, this.direction.isNeg);
    }

    grow() {
        this.length++;
        this.head = this.head.clone({ next: this.head });
    }

    turn(direction) {
        this.direction = {
            axis: direction[0],
            isNeg: direction[1] === "-"
        };
    }
};
