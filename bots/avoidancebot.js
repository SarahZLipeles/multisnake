bot = function(direction, foods, snakes, socket) {
	const mySnakeHead = snakes[socket.id].body[0].position;
	let min = 200;
	let currSum, mindex;
	const table = {};
	for (let i = 0; i < foods.length; i++) {
		currSum = Math.abs(foods[i].position.x - mySnakeHead.x) +
			Math.abs(foods[i].position.y - mySnakeHead.y) +
			Math.abs(foods[i].position.z - mySnakeHead.z);
		if (currSum < min) {
			min = currSum;
			mindex = i;
		}
	}
	for (let currSnake in snakes) {
		currSnake = snakes[currSnake];
		for (var j = 0; j < currSnake.length; j++) {
			let currLoc = currSnake[j];
			table[currLoc.x + "," + currLoc.y + "," + currLoc.z] = "snake";
		}
	}
	const firstFood = foods[mindex].position;
	if (direction !== "x+") {
		if (firstFood.x !== mySnakeHead.x ) {
			direction = "x";
			if (firstFood.x < mySnakeHead.x) {
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
		} else if (firstFood.y !== mySnakeHead.y ) {
			direction = "y";
			if (firstFood.y < mySnakeHead.y) {
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
		} else if (firstFood.z !== mySnakeHead.z ) {
			direction = "z";
			if (firstFood.z < mySnakeHead.z) {
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
		if (firstFood.x > mySnakeHead.x ) {
			return direction;
		}
		(direction = "z+");
	}
	return direction;
};
