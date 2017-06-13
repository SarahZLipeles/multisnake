const { expect } = require("chai");
const Entity = require("./Entity");

/* global describe it beforeEach */

describe("Entity", () => {
  const position = [5, 10, 15];
  let testEntity;

  beforeEach("creates a new entity", () => {
    testEntity = new Entity(...position);
  });

  it("has x, y, and z properties", () => {
    expect(testEntity).to.have.keys("x", "y", "z");
  });

  it("has correct property values", () => {
    expect(testEntity).to.deep.equal({ x: position[0], y: position[1], z: position[2] });
  });

  it("has default property values of 0", () => {
    const newEntity = new Entity();
    expect(newEntity).to.deep.equal({ x: 0, y: 0, z: 0 });
  });

  it("copies position of another entity", () => {
    const newEntity = new Entity(4, 9, 14);
    testEntity.copyPosition(newEntity);
    expect(testEntity.x).to.equal(newEntity.x);
    expect(testEntity.y).to.equal(newEntity.y);
    expect(testEntity.z).to.equal(newEntity.z);
  });

  it("checks if another entity coincides", () => {
    const nonCoincideEntity = new Entity(5, 10, 14);
    const coincideEntity = new Entity(...position);
    expect(testEntity.coincides(nonCoincideEntity)).to.equal(false);
    expect(testEntity.coincides(coincideEntity)).to.equal(true);
  });

  it("clones a new entity", () => {
    const clonedEntity = testEntity.clone();
    expect(clonedEntity).to.deep.equal({ x: position[0], y: position[1], z: position[2] });
  });
});
