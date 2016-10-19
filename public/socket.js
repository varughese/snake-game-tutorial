var socket = io();

socket.on('ate_food', function(msg) {
	console.log("ate food");
	snake.tail.pop();
});
