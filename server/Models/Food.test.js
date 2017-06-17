const { expect } = require("chai");
const Entity = require("./Entity");
const Food = require("./Food");

/* global describe it */

describe("Food", () => {
	it("extends from Entity", () => {
		expect(new Food()).to.be.instanceOf(Entity);
	});

	const range = 45;
	let testFood;

	beforeEach("create a new food", () => {
		testFood = new Food(range, 256);
	});

	it("has x, y, z, and value properties", () => {
		expect(testFood).to.have.keys("x", "y", "z", "value");
	});

	it("has x, y, and z values within range", () => {
		for (var i = 0; i < 10; i++) {
			const randFood = new Food(range);
			expect(Math.abs(randFood.x) <= range).to.equal(true);
			expect(Math.abs(randFood.y) <= range).to.equal(true);
			expect(Math.abs(randFood.z) <= range).to.equal(true);
		}
	});

	it("has correct property value", () => {
		expect(testFood).to.include({ value: 256 });
	});

});
