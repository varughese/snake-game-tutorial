var socket = io();

socket.on('ate_food', function(msg) {
	console.log("ate food");
	snake.tail.pop();
});

socket.on('coords', function(coords) {
	otherSnake.x = coords[0];
	otherSnake.y = coords[1];
	otherSnake.tail = coords[2];
});
