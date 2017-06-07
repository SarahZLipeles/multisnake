const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild( renderer.domElement );



var light = new THREE.PointLight( 0x00ffff, 1, 200 );
light.position.set( -100, -100, -100 );
light.castShadow = true;
scene.add( light );


// Size constants
//----------------------------------------
const boxSize = 100;
const numSegments = 100;
const segmentSize = boxSize / numSegments;
//----------------------------------------

let direction = "x+"; // Format axis (x,y,z) direction (+, -)
let snake = [];

// Geometries
//--------------------------------------------------------------------------
const snakeGeometry = new THREE.BoxGeometry(
	segmentSize, segmentSize, segmentSize
);
const playAreaGeometry = new THREE.BoxGeometry(
	boxSize, boxSize, boxSize, numSegments, numSegments, numSegments
);
const foodGeometry = new THREE.OctahedronGeometry(segmentSize);
//--------------------------------------------------------------------------

//Materials
//--------------------------------------------------------------------------
const snakeMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const playAreaMaterial = new THREE.MeshBasicMaterial( { wireframe: true } );
const foodMaterial = new THREE.MeshBasicMaterial( { color: 0xffb6c1 } );
//--------------------------------------------------------------------------


// Play area cube creation
//--------------------------------------------------------------------------
const playArea = new THREE.Mesh( playAreaGeometry, playAreaMaterial );
scene.add(playArea);
//--------------------------------------------------------------------------


let snakeBody;


// Initializes the snake
//-------------------------------------------------------------
function init() {
	snake = [];
	snakeBody = new THREE.Mesh( snakeGeometry, snakeMaterial );
	snakeBody.recieveShadow = true;
	scene.add(snakeBody);
	snakeBody.position.set(0,0,0);
	camera.position.z = 500;
	snake.push(snakeBody);
}
//-------------------------------------------------------------

init();
const head = snake[0];

function grow() {
	snakeBody = new THREE.Mesh( snakeGeometry, snakeMaterial );
	snakeBody.recieveShadow = true;
	snakeBody.castShadow = true;
	scene.add(snakeBody);
	copyPosition(snakeBody, head);
	snake.push(snakeBody);
}


function copyPosition(originCube, destinationCube) { // copies destination cube's location onto origin cube
	originCube.position.x = destinationCube.position.x;
	originCube.position.y = destinationCube.position.y;
	originCube.position.z = destinationCube.position.z;
}
let grid;
function makeFood() {
	const gridGeometry = new THREE.BoxGeometry( boxSize, boxSize, segmentSize, numSegments, numSegments );
	grid = new THREE.Mesh( gridGeometry, playAreaMaterial );
	food = new THREE.Mesh( foodGeometry, foodMaterial );
	food.recieveShadow = true;
	food.castShadow = true;
	scene.add(food);
	food.position.set((Math.floor(Math.random() * boxSize) - boxSize/2), (Math.floor(Math.random() * boxSize) - boxSize/2), (Math.floor(Math.random() * boxSize) - boxSize/2));
	// scene.add(grid);
	// grid.position.set(0, 0, food.position.z);
}
makeFood();
function render() {
	setTimeout(function() {
		const next = {position: new THREE.Vector3(0,0,0)};
		requestAnimationFrame( render );
		renderer.render( scene, camera );
		// if (snake.length >= 3) {
			for(let c = snake.length - 1; c > 0 ; c--) {
				copyPosition(snake[c], snake[c - 1]); }
		// }

		axis = direction[0];
		copyPosition(next, head);
		if (direction[1] === "+") {
			next.position[axis] = snake[0].position[axis] + segmentSize;
		} else {
			next.position[axis] = snake[0].position[axis] - segmentSize;
		}

		if(next.position.x === food.position.x && next.position.y === food.position.y && next.position.z === food.position.z) {
			grow();
			grow();
			grow();
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
	const key = e.which;
	if(key == "37" && direction != "x+") direction = "x-";
	else if(key == "38" && direction != "z+") direction = "z-";
	else if(key == "39" && direction != "x-") direction = "x+";
	else if(key == "40" && direction != "z-") direction = "z+";
	else if(key == "87" && direction != "y-") direction = "y+";
	else if(key == "83" && direction != "y+") direction = "y-";
});
