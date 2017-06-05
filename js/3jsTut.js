var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
document.body.appendChild( renderer.domElement );

var boxSize = 100;
var numSegments = 100;
var d = "x+";

var geometry = new THREE.BoxGeometry( boxSize, boxSize, boxSize, numSegments, numSegments, numSegments );
var material = new THREE.MeshBasicMaterial( { wireframe: true } );
var cube = new THREE.Mesh( geometry, material );
// var box = new THREE.BoxHelper( cube );

scene.add(cube);

var segmentSize = boxSize / numSegments;

var snake = [];

var snakeGeometry = new THREE.BoxGeometry( segmentSize, segmentSize, segmentSize );
var snakeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );

var foodMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000 } );

var snakeBody;
d = "x+";
function init() {
	snakeBody = new THREE.Mesh( snakeGeometry, snakeMaterial );
	scene.add(snakeBody);
	snakeBody.position.set(0,0,0);
	camera.position.z = 500;
	snake.push(snakeBody);
}

init();

function copyPosition(originCube, destinationCube) { // copies destination cube's location onto origin cube
	originCube.position.x = destinationCube.position.x;
	originCube.position.y = destinationCube.position.y;
	originCube.position.z = destinationCube.position.z;
}
var grid;
function makeFood() {
	var geometrygrid = new THREE.BoxGeometry( boxSize, boxSize, segmentSize, numSegments, numSegments );
	grid = new THREE.Mesh( geometrygrid, material );
	food = new THREE.Mesh( snakeGeometry, foodMaterial );
	scene.add(food);
	food.position.set((Math.floor(Math.random() * boxSize) - boxSize/2), (Math.floor(Math.random() * boxSize) - boxSize/2), (Math.floor(Math.random() * boxSize) - boxSize/2));
	scene.add(grid);
	grid.position.set(0, 0, food.position.z);
}
var head = snake[0];
makeFood();
function render() { 
	setTimeout(function() {
		var next = {position: new THREE.Vector3(0,0,0)};
		requestAnimationFrame( render );
		renderer.render( scene, camera );
		// if (snake.length >= 3) {
			for(var c = snake.length - 1; c > 0 ; c--) {
				copyPosition(snake[c], snake[c - 1]); }
		// }

		axis = d[0];
		copyPosition(next, head);
		if (d[1] === "+") {
			next.position[axis] = snake[0].position[axis] + segmentSize;
		} else {
			next.position[axis] = snake[0].position[axis] - segmentSize;
		}

		if(next.position.x === food.position.x && next.position.y === food.position.y && next.position.z === food.position.z) {
			init();
			init();
			init();
			scene.remove(food);
			scene.remove(grid);
			makeFood();
		}
		copyPosition(camera, next);
		camera.position.z += segmentSize * 20;
		camera.position.x -= segmentSize * 15;
		camera.position.y += segmentSize * 15;
		camera.lookAt(next.position);
		copyPosition(head, next);
	}, 66);
}

render();

document.addEventListener("keydown", function(e){
	var key = e.which;
	if(key == "37" && d != "x+") d = "x-";
	else if(key == "38" && d != "z+") d = "z-";
	else if(key == "39" && d != "x-") d = "x+";
	else if(key == "40" && d != "z-") d = "z+";
	else if(key == "87" && d != "y-") d = "y+";
	else if(key == "83" && d != "y+") d = "y-";
});