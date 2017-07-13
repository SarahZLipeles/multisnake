bot = function(direction, foods, snakes, socket) {
	const mySnakeHead = snakes[socket.id].position;
	let min = 200;
	let currSum;
	let mindex = 0;
	for (let i = 0; i < foods.length; i++) {
		currSum = Math.abs(foods[i].position.x - mySnakeHead.x) +
			Math.abs(foods[i].position.y - mySnakeHead.y) +
			Math.abs(foods[i].position.z - mySnakeHead.z);
		if (currSum < min) {
			min = currSum;
			mindex = i;
		}
	}
	const firstFood = foods[mindex].position;
	if (direction !== "x+") {
		if (firstFood.x !== mySnakeHead.x ) {
			direction = "x" + ((firstFood.x < mySnakeHead.x) ? ("-") : ("+"));
			if (firstFood.x < mySnakeHead.x) {
				direction += "-";
			} else {
				direction += "+";
			}
		} else if (firstFood.y !== mySnakeHead.y ) {
			direction = "y" + ((firstFood.y < mySnakeHead.y) ? ("-") : ("+"));
		} else if (firstFood.z !== mySnakeHead.z ) {
			direction = "z" + ((firstFood.z < mySnakeHead.z) ? ("-") : ("+"));
		}
	} else {
		if (firstFood.x > mySnakeHead.x ) {
			return direction;
		}
		(direction = "z+");
	}
	return direction;
};
