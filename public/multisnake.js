/* global THREE io */

const socket = io()
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// Size constants
//----------------------------------------
const boxSize = 100;
const numSegments = 100;
const segmentSize = boxSize / numSegments;
//----------------------------------------

let direction = 'x+'; // Format axis (x,y,z) direction (+, -)
let snake = [];


// Lighting
//--------------------------------------------------------------------------
const lights = [];
for (let i = 0; i < 8; i++) {
	lights.push(new THREE.PointLight(0xffffff, 0.4, boxSize * 2))
}
lights.push(new THREE.AmbientLight(0x404040));
lights[0].position.set(-(boxSize / 2), -(boxSize / 2), -(boxSize / 2));
lights[1].position.set(-(boxSize / 2), -(boxSize / 2), (boxSize / 2));
lights[2].position.set(-(boxSize / 2), (boxSize / 2), -(boxSize / 2));
lights[3].position.set(-(boxSize / 2), (boxSize / 2), (boxSize / 2));
lights[4].position.set((boxSize / 2), -(boxSize / 2), -(boxSize / 2));
lights[5].position.set((boxSize / 2), -(boxSize / 2), (boxSize / 2));
lights[6].position.set((boxSize / 2), (boxSize / 2), -(boxSize / 2));
lights[7].position.set((boxSize / 2), (boxSize / 2), (boxSize / 2));
for (let i = 0; i < lights.length; i++) {
	scene.add(lights[i]);
}
//--------------------------------------------------------------------------

// Geometries
//--------------------------------------------------------------------------
const snakeGeometry = new THREE.BoxGeometry(
	segmentSize, segmentSize, segmentSize
);
const playAreaGeometry = new THREE.BoxGeometry(
	boxSize, boxSize, boxSize, numSegments, numSegments, numSegments
);
const foodGeometry = new THREE.OctahedronGeometry(segmentSize);
const wallGeometry = new THREE.PlaneGeometry(boxSize, boxSize, segmentSize, segmentSize);
//--------------------------------------------------------------------------

//Materials
//--------------------------------------------------------------------------
const snakeMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00, shininess: 100 });
const foodMaterial = new THREE.MeshPhongMaterial({ color: 0xFF4D4D, shininess: 100 });
const zNegWallMaterial = new THREE.MeshPhongMaterial({ color: 0x90C3D4 });
const zPosWallMaterial = new THREE.MeshPhongMaterial({ color: 0xD4A190 });
const xPosWallMaterial = new THREE.MeshPhongMaterial({ color: 0xC390D4 });
const xNegWallMaterial = new THREE.MeshPhongMaterial({ color: 0xA1D490 });
const yNegWallMaterial = new THREE.MeshPhongMaterial({ color: 0xCED490 });
const yPosWallMaterial = new THREE.MeshPhongMaterial({ color: 0xCED490 });
//--------------------------------------------------------------------------


// Play area cube creation
//--------------------------------------------------------------------------
// const playArea = new THREE.Mesh( playAreaGeometry, playAreaMaterial );
// scene.add(playArea);
const zNegWall = new THREE.Mesh(wallGeometry, zNegWallMaterial);
const zPosWall = new THREE.Mesh(wallGeometry, zPosWallMaterial);
const xPosWall = new THREE.Mesh(wallGeometry, xPosWallMaterial);
const xNegWall = new THREE.Mesh(wallGeometry, xNegWallMaterial);
const yNegWall = new THREE.Mesh(wallGeometry, yNegWallMaterial);
const yPosWall = new THREE.Mesh(wallGeometry, yPosWallMaterial);
scene.add(zNegWall);
scene.add(zPosWall);
scene.add(xPosWall);
scene.add(xNegWall);
scene.add(yNegWall);
scene.add(yPosWall);
zNegWall.position.set(0, 0, -(boxSize / 2));
zPosWall.position.set(0, 0, (boxSize / 2));
zPosWall.rotation.y = (Math.PI);
xPosWall.position.set(boxSize / 2, 0, 0);
xPosWall.rotation.y = -(Math.PI / 2);
xNegWall.position.set(-(boxSize / 2), 0, 0);
xNegWall.rotation.y = (Math.PI / 2);
yNegWall.position.set(0, -(boxSize / 2), 0);
yNegWall.rotation.x = -(Math.PI / 2);
yPosWall.position.set(0, (boxSize / 2), 0);
yPosWall.rotation.x = (Math.PI / 2);
//--------------------------------------------------------------------------


let snakeBody, head, next, food;

// Initializes the snake
//-------------------------------------------------------------
function init() {
	if (snake.length > 0) {
		scene.remove(food);
		makeFood();
	}
	while (snake.length > 0) {
		scene.remove(snake.pop());
	}
	snakeBody = new THREE.Mesh(snakeGeometry, snakeMaterial);
	scene.add(snakeBody);
	snakeBody.position.set(0, 0, 0);
	camera.position.set(0, 0, 0);
	snake.push(snakeBody);
	head = snake[0];
	next = { position: new THREE.Vector3(0, 0, 0) };
}
//-------------------------------------------------------------

init();
head = snake[0];

//-------------------------------------------------------------
function grow() {
	snakeBody = new THREE.Mesh(snakeGeometry, snakeMaterial);
	scene.add(snakeBody);
	copyPosition(snakeBody, head);
	snake.push(snakeBody);
}
//-------------------------------------------------------------

//--------------------------------------------------------------------------
function copyPosition(originCube, destinationCube) { // copies destination cube's location onto origin cube
	originCube.position.x = destinationCube.position.x;
	originCube.position.y = destinationCube.position.y;
	originCube.position.z = destinationCube.position.z;
}
//--------------------------------------------------------------------------


let grid;

//--------------------------------------------------------------------------
function makeFood() {
	food = new THREE.Mesh(foodGeometry, foodMaterial);
	scene.add(food);
	food.position.set((Math.floor(Math.random() * boxSize) - boxSize / 2), (Math.floor(Math.random() * boxSize) - boxSize / 2), (Math.floor(Math.random() * boxSize) - boxSize / 2));
}
//--------------------------------------------------------------------------

function rotateFood(speed) {
	food.rotation.y -= speed;
}


makeFood();

// Collision checker
//--------------------------------------------------------------------------
function checkCollisions(next) {
	if (Math.abs(next.position.x) > (boxSize / 2) ||
		Math.abs(next.position.y) > (boxSize / 2) ||
		Math.abs(next.position.z) > (boxSize / 2)) {
		init();
	} else {
		for (var i = 0; i < snake.length; i++) {
			if (next.position.x === snake[i].position.x &&
				next.position.y === snake[i].position.y &&
				next.position.z === snake[i].position.z) { init(); }
		}
		if (next.position.x === food.position.x &&
			next.position.y === food.position.y &&
			next.position.z === food.position.z) {
			grow();
			grow();
			grow();
			scene.remove(food);
			scene.remove(grid);
			makeFood();
		}
	}
}
//--------------------------------------------------------------------------


// Render Loop
//--------------------------------------------------------------------------
function render() {
	setTimeout(function () {

		next = { position: new THREE.Vector3(0, 0, 0) };
		requestAnimationFrame(render);
		renderer.render(scene, camera);
		for (let c = snake.length - 1; c > 0; c--) {
			copyPosition(snake[c], snake[c - 1]);
		}

		rotateFood(0.1);
		axis = direction[0];
		copyPosition(next, head);
		if (direction[1] === '+') {
			next.position[axis] = snake[0].position[axis] + segmentSize;
		} else {
			next.position[axis] = snake[0].position[axis] - segmentSize;
		}

		checkCollisions(next);
		// External Cam
		//---------------------------------------
		copyPosition(camera, next);
		camera.position.z += segmentSize * 15;
		camera.position.x -= segmentSize * 10;
		camera.position.y += segmentSize * 10;
		camera.lookAt(next.position);
		//---------------------------------------
		// Snake Cam
		//---------------------------------------
		// camera.lookAt(next.position);
		// copyPosition(camera, next);
		//---------------------------------------
		// Steady Cam
		//---------------------------------------
		// camera.lookAt(next.position);
		//---------------------------------------

		copyPosition(head, next);
	}, 66);
}
//--------------------------------------------------------------------------

render();

// Directional Key Listeners
//--------------------------------------------------------------------------
document.addEventListener('keydown', function (event) {
	const key = event.which;
	if (key === '37' && direction !== 'x+') direction = 'x-';
	else if (key === '38' && direction !== 'z+') direction = 'z-';
	else if (key === '39' && direction !== 'x-') direction = 'x+';
	else if (key === '40' && direction !== 'z-') direction = 'z+';
	else if (key === '87' && direction !== 'y-') direction = 'y+';
	else if (key === '83' && direction !== 'y+') direction = 'y-';
});
//--------------------------------------------------------------------------

// Perspectice Directional Key Listeners unfinished
//--------------------------------------------------------------------------
// document.addEventListener("keydown", function(e){
// 	const key = e.which;
// 	if ( key == "37" ) { // left arrow
// 			if (direction[0] === "x") {
// 				direction = "z" + ((direction[1] === "+") ? ("-") : ("+"));
// 			} else if (direction[0] === "y") {
// 				direction = "z" + ((direction[1] === "+") ? ("-") : ("+"));)
// 		}
// 	}

// 	if (key == "37" && direction !== "x+") direction = "x-";
// 	else if (key == "38" && direction !== "z+") direction = "z-";
// 	else if (key == "39" && direction !== "x-") direction = "x+";
// 	else if (key == "40" && direction !== "z-") direction = "z+";
// 	else if (key == "87" && direction !== "y-") direction = "y+";
// 	else if (key == "83" && direction !== "y+") direction = "y-";
// });
//--------------------------------------------------------------------------
