const { expect } = require("chai");
const Snake = require("./Snake");
const SnakeSegment = require("./SnakeSegment");
const Entity = require("./Entity");

/* global describe it beforeEach*/

describe("Snake", () => {
  let snake;
  beforeEach("creates a new snake", () => {
    snake = new Snake(1);
  });

  it("has id, length, direction, and head properties", () => {
    expect(snake).to.have.keys("id", "length", "direction", "head");
  });

  it("has correct default values", () => {
    expect(snake).to.deep.equals({ id: 1, length: 1, direction: { axis: "x", isNeg: false }, head: new SnakeSegment() });
  });

  it("grows properly", () => {
    snake.grow();
    snake.grow();
    snake.grow();
    expect(snake.length).to.equal(4);
    let lengthCount = 0;
    let currSegment = snake.head;
    while (currSegment) {
      lengthCount++;
      currSegment = currSegment.next;
    }
    expect(lengthCount).to.equal(snake.length);
  });

  it("moves the head correctly", () => {
    const coincideEntity = new Entity(1, 0, 0);
    const nonCoincideEntity = new Entity(0, 0, 0);
    snake.move();
    expect(snake.head.coincides(coincideEntity)).to.be.equal(true);
    expect(snake.head.coincides(nonCoincideEntity)).to.be.equal(false);
  });

  it("changes direction", () => {
    snake.turn("y-");
    expect(snake.direction).to.deep.equal({ axis: "y", isNeg: true });
  });

  it("can move the head correctly after it turns", () => {
    const coincideEntity = new Entity(0, -2, 0);
    snake.turn("y-");
    snake.move();
    snake.move();
    expect(snake.head.coincides(coincideEntity)).to.be.equal(true);
  });

  it("moves all snake segments", () => {
    const segmentOne = new Entity(2, 0, -4);
    const segmentTwo = new Entity(2, 0, -3);
    const segmentThree = new Entity(2, 0, -2);
    snake.grow(); // 000 000
    snake.move(); // 100 000
    snake.grow(); // 100 100 000
    snake.move(); // 200 100 100
    snake.turn("z-");
    snake.move(); // 20-1 200 100
    snake.move(); // 20-2 20-1 200
    snake.move(); // 20-3 20-2 20-1
    snake.move(); // 20-4 20-3 20-2
    expect(snake.head.coincides(segmentOne)).to.be.equal(true);
    expect(snake.head.next.coincides(segmentTwo)).to.be.equal(true);
    expect(snake.head.next.next.coincides(segmentThree)).to.be.equal(true);
  });
});
