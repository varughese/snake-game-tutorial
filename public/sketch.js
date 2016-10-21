var snake;
var otherSnake;
var food;
var scl = 10;
var HEIGHT = 500;
var WIDTH = 500;

function setup() {
    createCanvas(WIDTH, HEIGHT);
    frameRate(15);
    snake = new Snake();
    otherSnake = new Snake(true);
    food = new Food();
}

function draw() {
    background(51);
    snake.update();
    food.show();
    otherSnake.display();
    snake.display();
}

function Food() {
    this.x = 0;
    this.y = 0;
    this.show = function() {
        // noStroke();
        fill(255, 159, 25);
        rect(this.x, this.y, scl, scl);
    };

    function inTail(x, y, tail) {
        for(var i=0; i<tail.length; i++) {
            if(tail[i][0] === x && tail[i][1] === y) {
                return true;
            }
        }
        return false;
    }

    this.changePosition = function(tail) {
        var x, y;
        var protection = 0;
        do {
            protection++;
            if(protection > 140) {
                console.log("break");
                break;
            }
            x = Math.floor(random(0, WIDTH/scl)) * scl;
            y = Math.floor(random(0, HEIGHT/scl)) * scl;
        } while (inTail(x, y, tail));

        this.x = x;
        this.y = y;

    };
}

function Snake(other) {
    this.tail = [];
    this.x = floor(WIDTH / scl / 2) * scl;
    this.color = other ? [20,20,20] : [255,255,255];
    this.y = floor(HEIGHT / scl / 2) * scl;
    this.enemy = !!other;
    this.direction = "RIGHT";
    function checkCollision(x, y, tail) {
        for(var t=0; t<tail.length; t++) {
            if(tail[t][0] === x &&
               tail[t][1] === y ) {
                   return true;
            }
        }
        return false;
    }
    this.update = function() {
        if(this.direction === "RIGHT") {
            this.x = this.x + scl;
        } else if(this.direction === "LEFT") {
            this.x = this.x - scl;
        } else if(this.direction === "UP") {
            this.y = this.y - scl;
        } else {
            this.y = this.y + scl;
        }

        if(this.x >= WIDTH) {
            this.x = 0;
        }
        if(this.x < 0) {
            this.x = WIDTH;
        }
        if(this.y >= HEIGHT) {
            this.y = 0;
        }
        if(this.y < 0) {
            this.y = HEIGHT;
        }

        if(this.x === food.x && this.y === food.y) {
            this.eat();
        }

        for(var i=this.tail.length-1; i>=1; i--) {
            this.tail[i] = this.tail[i-1];
        }

        if(checkCollision(this.x, this.y, otherSnake.tail)) {
            if(this.tail.length > otherSnake.tail.length) {
                socket.emit('pop_enemy');
            } else {
                this.tail.pop();
            }
        }

        if(checkCollision(this.x, this.y, this.tail.slice(1))) {
            this.tail.pop();
        }

        this.tail[0] = [this.x, this.y];
        if(!this.enemy) socket.emit("coords", [this.x, this.y, this.tail]);

    };

    this.aiControl = function() {
        if(this.y > food.y) { snake.direction = "UP"; }
        else if(this.y < food.y) { snake.direction = "DOWN"; }
        else if(this.y === food.y) {
            if(this.x > food.x) snake.direction = "LEFT";
            if(this.x < food.x) snake.direction = "RIGHT";
        }
    };

    this.eat = function() {
        food.changePosition(this.tail);
        this.tail.push([this.x, this.y]);
		socket.emit('pop_enemy', [this.x, this.y]);
    };

    this.display = function() {
        fill(this.color[0], this.color[1], this.color[2]);
        // rect(this.x, this.y, scl, scl);
        for(var i=0; i<this.tail.length; i++) {
            rect(this.tail[i][0],this.tail[i][1], scl, scl);
        }

    };
}


var fast = false;
function keyPressed() {
  if (keyCode === UP_ARROW) {
    snake.direction = "UP";
  } else if (keyCode === DOWN_ARROW) {
    snake.direction = "DOWN";
  } else if (keyCode === RIGHT_ARROW) {
    snake.direction = "RIGHT";
  } else if (keyCode === LEFT_ARROW) {
    snake.direction = "LEFT";
} else if(keyCode === 32) {
    fast = !fast;
    if(fast) {
        frameRate(40);
    } else {
        frameRate(15);
    }
    if(fast && snake.tail.length > 2) {
        snake.tail.pop();
    }
}
}
