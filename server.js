var express = require("express");
var app = express();
var server = require("http").Server(app);
var io = require('socket.io')(server);
var path = require("path");

app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function() {
	  console.log("user disconnected");
  });

  socket.on('ate_food', function(msg){
	socket.broadcast.emit('ate_food', msg);
  });

  socket.on("coords", function(coords) {
	 socket.broadcast.emit("coords", coords); 
  });
});

server.listen(3000);
