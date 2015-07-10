var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var size = 400;
var d = "x+";

var geometry = new THREE.BoxGeometry( size, size, size, 40, 40, 40 );
var material = new THREE.MeshBasicMaterial( { wireframe: true } );
var cube = new THREE.Mesh( geometry, material );
// var box = new THREE.BoxHelper( cube );

scene.add(cube);

var size2 = size / 40;

var snake = [];

var geometry2 = new THREE.BoxGeometry( size2, size2, size2 );
var material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
var cube2;
d = "x+";
function init() {
	 cube2 = new THREE.Mesh( geometry2, material2 );
	scene.add(cube2);
	cube2.position.set(-1 * ((size / 2) - size2 / 2), (size / 2) - size2 / 2, (size / 2) - size2 / 2);
	camera.position.z = 500;
	snake.push(cube2);
}

init();

function copyPosition(originCube, destinationCube) {
	originCube.position.x = destinationCube.position.x;
	originCube.position.y = destinationCube.position.y;
	originCube.position.z = destinationCube.position.z;
}

function makeFood() {
	food = new THREE.Mesh( geometry2, material2 );
	scene.add(food);
	food.position.set(Math.round(Math.random() * 400 - 200), Math.round(Math.random() * 400 - 200), Math.round(Math.random() * 400 - 200));
}
var head = snake[0];
makeFood();
function render() { 
	setTimeout(function() {
		var next = {position: new THREE.Vector3(0,0,0)};
		requestAnimationFrame( render );
		renderer.render( scene, camera );
		if (snake.length >= 3) {
			for(var c = snake.length - 1; c > 0 ; c--) {
				copyPosition(snake[c], snake[c - 1]);
			}
		}

		axis = d[0];
		copyPosition(next, head);
		if (d[1] === "+") {
			next.position[axis] = snake[0].position[axis] + size2;
		} else {
			next.position[axis] = snake[0].position[axis] - size2;
		}
		if (snake.length < 20) {
			init();
		}

		if(head.position.x === food.position.x && head.position.y === food.position.y && head.position.z === food.position.z) {
			init();
			scene.remove(food);
			makeFood();
		}
		camera.position.z = next.position.z + 300;
		copyPosition(head, next);
	}, 70);
}

render();

document.addEventListener("keydown", function(e){
	var key = e.which;
	if(key == "37" && d != "x+") d = "x-";
	else if(key == "38" && d != "y-") d = "y+";
	else if(key == "39" && d != "x-") d = "x+";
	else if(key == "40" && d != "y+") d = "y-";
	else if(key == "87" && d != "z+") d = "z-";
	else if(key == "83" && d != "z-") d = "z+";
});