const { expect } = require("chai");
const Entity = require("./Entity");
const Food = require("./Food");

/* global describe it */

describe("Food", () => {
  it("extends from Entity", () => {
    expect(new Food()).to.be.instanceOf(Entity);
  });

  const position = [5, 10, 15];
  let testFood;

  beforeEach("create a new food", () => {
    testFood = new Food(...position, 256);
  });

  it("has x, y, z, and value properties", () => {
    expect(testFood).to.have.keys("x", "y", "z", "value");
  });

  it("has correct property values", () => {
    expect(testFood).to.include({ x: position[0], y: position[1], z: position[2], value: 256 });
  });

  it("has default property values of 0 and null next value", () => {
    const newFood = new Food();
    expect(newFood).to.deep.equal({ x: 0, y: 0, z: 0, value: 1 });
  });

  it("clones a new food", () => {
    const clonedEntity = testFood.clone();
    expect(clonedEntity).to.deep.equal({ x: position[0], y: position[1], z: position[2], value: 256});
  });
});
