const Entity = require('./Entity');
const SnakeSegment = require('./SnakeSegment');

class Snake {
    constructor(id, length = 1, direction = 'x+') {
        this.id = id;
        this.length = length;
        this.direction = {
            axis: direction[0],
            isPos: direction[1] === '+'
        };
        this.head = new SnakeSegment();
    }

    move() {
        let currSegment = this.head;
        const tmpCoords = new Entity();
        while (currSegment.next) {
            tmpCoords.copyPosition(currSegment);
            currSegment = currSegment.next.copyPosition(tmpCoords);
        }
    }

    grow() {
        const newSnakeSegment = new SnakeSegment(this.head.x, this.head.y, this.head.z)
        newSnakeSegment.next = this.head.next
        this.head.next = newSnakeSegment
    }
}

