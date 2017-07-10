bot = function(direction, foods, snakes, socket) {
	const distance = function(a, b) {
		return Math.abs(a.x - b.x) +
				Math.abs(a.y - b.y) +
				Math.abs(a.z - b.z);
	};
	const mySnakeHead = snakes[socket.id].body[0].position;
	let min = 200;
	let currSum, mindex;
	const table = {};
	for (let currSnake in snakes) {
		currSnake = snakes[currSnake];
		for (let j = 0; j < currSnake.length; j++) {
			let currLoc = currSnake[j];
			table[currLoc.x + "," + currLoc.y + "," + currLoc.z] = "snake";
		}
		for (let j = 0; j < foods.length; j++) {
			if (foods.length > 1 &&
			distance(currSnake[0], foods[j].position) < distance(mySnakeHead, foods[j].position)) {
				foods.splice(j, 1);
				j--;
			}
		}
	}
	for (let i = 0; i < foods.length; i++) {
		currSum = distance(foods[i].position, mySnakeHead);
		if (currSum < min) {
			min = currSum;
			mindex = i;
		}
	}
	let targetFood = foods[mindex].position;
	if (direction !== "x+") {
		if (targetFood.x !== mySnakeHead.x ) {
			direction = "x";
			if (targetFood.x < mySnakeHead.x) {
				direction += "-";
				if (table[(mySnakeHead.x - 1) + "," + mySnakeHead.y + "," + mySnakeHead.z] === "snake") {
					direction = "y+";
				}
			} else {
				direction += "+";
				if (table[(mySnakeHead.x + 1) + "," + mySnakeHead.y + "," + mySnakeHead.z] === "snake") {
					direction = "y-";
				}
			}
		} else if (targetFood.y !== mySnakeHead.y ) {
			direction = "y";
			if (targetFood.y < mySnakeHead.y) {
				direction += "-";
				if (table[mySnakeHead.x + "," + (mySnakeHead.y - 1) + "," + mySnakeHead.z] === "snake") {
					direction = "z+";
				}
			} else {
				direction += "+";
				if (table[mySnakeHead.x + "," + (mySnakeHead.y + 1) + "," + mySnakeHead.z] === "snake") {
					direction = "z-";
				}
			}
		} else if (targetFood.z !== mySnakeHead.z ) {
			direction = "z";
			if (targetFood.z < mySnakeHead.z) {
				direction += "-";
				if (table[mySnakeHead.x + "," + mySnakeHead.y + "," + (mySnakeHead.z - 1)] === "snake") {
					direction = "x+";
				}
			} else {
				direction += "+";
				if (table[mySnakeHead.x + "," + mySnakeHead.y + "," + (mySnakeHead.z + 1)] === "snake") {
					direction = "x-";
				}
			}
		}
	} else {
		if (targetFood.x > mySnakeHead.x ) {
			return direction;
		}
		(direction = "z+");
	}
	return direction;
};
