/* global THREE io */
const stats = new Stats();
const socket = io();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

stats.showPanel( 3 ); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );
const ping = stats.addPanel( new Stats.Panel( "Ping", "#ff8", "#221" ) );
const score = stats.addPanel(new Stats.Panel( "Score", "#000", "#fff" ));

// Size constants
//----------------------------------------
const boxSize = 100;
const numSegments = 100;
const segmentSize = boxSize / numSegments;
//----------------------------------------

let direction = "z-"; // Format axis (x,y,z) direction (+, -)
let mySnake; // Array of snake segments
let foods = [];
let snakes = {}; // Other players, Format {socketid: {direction: "", snake: []}}


// Lighting
//--------------------------------------------------------------------------
const lights = [];
for (let i = 0; i < 8; i++) {
	lights.push(new THREE.PointLight(0xffffff, 0.4, boxSize * 2));
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
const foodGeometry = new THREE.OctahedronGeometry(segmentSize);
const wallGeometry = new THREE.PlaneGeometry(boxSize, boxSize, segmentSize, segmentSize);
//--------------------------------------------------------------------------

//Materials
//--------------------------------------------------------------------------
const snakeMaterial = new THREE.MeshPhongMaterial({
	color: 0x00ff00,
	shininess: 100
});
const foodMaterial = new THREE.MeshPhongMaterial({
	color: 0xFF4D4D,
	shininess: 100
});
const zNegWallMaterial = new THREE.MeshPhongMaterial({
	color: 0x90C3D4
});
const zPosWallMaterial = new THREE.MeshPhongMaterial({
	color: 0xD4A190
});
const xPosWallMaterial = new THREE.MeshPhongMaterial({
	color: 0xC390D4
});
const xNegWallMaterial = new THREE.MeshPhongMaterial({
	color: 0xA1D490
});
const yNegWallMaterial = new THREE.MeshPhongMaterial({
	color: 0xCED490
});
const yPosWallMaterial = new THREE.MeshPhongMaterial({
	color: 0xCED490
});
//--------------------------------------------------------------------------

camera.position.set(0, 10, 10);
// Play area cube creation
//--------------------------------------------------------------------------
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


// Render Loop
//--------------------------------------------------------------------------
function render() {
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
//--------------------------------------------------------------------------


//--------------------------------------------------------------------------
function drawSnake(snake) {
	let currMesh;
	snake.body = [];
	for (let i = 0; i < snake.length; i++) {
		currMesh = new THREE.Mesh(snakeGeometry, snakeMaterial);
		snake.body.push(currMesh);
		currMesh.position.set(snake[i].x * segmentSize, snake[i].y * segmentSize, snake[i].z * segmentSize);
		scene.add(currMesh);
	}
	return snake;
}

function deleteSnake(snake) {
	for (var i = 0; i < snake.body.length; i++) {
		scene.remove(snake.body[i]);
	}
	snake.body.length = 0;
}
//--------------------------------------------------------------------------


function setSnakes(newSnakes) {
	for (let id in newSnakes) {
		if (snakes[id] && snakes[id].body) deleteSnake(snakes[id]);
		snakes[id] = drawSnake(newSnakes[id]);
	}
}

function setFoods(newFoods) {
	let food;
	for (let i = 0; i < foods.length; i++) {
		scene.remove(foods[i]);
	}
	foods.length = 0;
	for (let i = 0; i < newFoods.length; i++) {
		food = new THREE.Mesh(foodGeometry, foodMaterial);
		foods.push(food);
		food.position.set(newFoods[i].x * segmentSize, newFoods[i].y * segmentSize, newFoods[i].z * segmentSize);
		scene.add(food);
	}
}

let ticker = new Date();
socket.emit("tick", direction);
stats.begin();
render();

// Sockets
//--------------------------------------------------------------------------
socket.on("connected", (id) => { snakes[id] = []; });
socket.on("dc", function (id) {
	deleteSnake(snakes[id]);
	delete snakes[id];
	console.log("disconnection id", id);
});
socket.on("state", function (state) {
	ping.update((new Date()) - ticker);
	score.update(state.snakes[socket.id].length);
	stats.end();
	if (ping > 500) return socket.disconnect("lagout");
	setSnakes(state.snakes);
	setFoods(state.foods);
	camera.position.x = snakes[socket.id].body[0].position.x - segmentSize * 10;
	camera.position.y = snakes[socket.id].body[0].position.y + segmentSize * 10;
	camera.position.z = snakes[socket.id].body[0].position.z + segmentSize * 15;
	camera.lookAt(snakes[socket.id].body[0].position);
	socket.emit("tick", direction);
	ticker = new Date();
	stats.begin();
});
//--------------------------------------------------------------------------

// Directional Key Listeners
//--------------------------------------------------------------------------
document.addEventListener("keydown", function (event) {
	const key = event.which;
	if (key === 37 && direction !== "x+") direction = "x-";
	else if (key === 38 && direction !== "z+") direction = "z-";
	else if (key === 39 && direction !== "x-") direction = "x+";
	else if (key === 40 && direction !== "z-") direction = "z+";
	else if (key === 87 && direction !== "y-") direction = "y+";
	else if (key === 83 && direction !== "y+") direction = "y-";
});
//--------------------------------------------------------------------------

document.addEventListener("visibilitychange", function() {
	socket.disconnect("left page");
});
