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
        this.tail = this.head;
    }

    move() {
        let currSegment = this.tail;
        while (currSegment.prev) {
            currSegment.copyPosition(currSegment.prev);
            currSegment = currSegment.prev;
        }
        this.head[this.direction.axis] += Math.pow(-1, this.direction.isNeg);
    }

    grow() {
        this.length++;
        this.head = this.head.clone({ next: this.head });
        this.head.next.prev = this.head;
    }

    turn(direction) {
        this.direction = {
            axis: direction[0],
            isNeg: direction[1] === "-"
        };
    }
};
