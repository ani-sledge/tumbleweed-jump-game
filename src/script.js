"use strict";
// Global Variables
var window;
var document;
var theCanvas;
var ctx;
var play;
var screenWidth = 600;
var width = 600;
var height = 200;
var floor = 130;
var score = 0;
var time = 0;
var isStopped = true;
var background = document.getElementById("canvas");
var dudeImg = document.getElementById("dude");
var playImg = document.getElementById("play");
var obImg = document.getElementById("obstacles");
// Moving Objects
var dude = { x: 50, y: floor, vel: -0.115, acc: 0.0004, up: false, img: dudeImg, width: 50, height: 50, start: 0 };
var obstacle = { x: width, y: floor, vel: 10, img: obImg, width: 50, height: 50, start: 0 }; 
var obstacle2 = { x: (width + 300), y: 130, vel: 10, img: obImg, width: 50, height: 50, start: 50 }; 
var background = {x: 0, y: 0, vel: 2, img: background, width: width, height: height, pos: [0,20] };

var advanceGame = function() {
    ctx.clearRect(0,0,width,height);
    dude.start = dude.start + 50;
    if (dude.start >= 150) {
        dude.start = 0;
    }
    panBackground(background);
    panObstacle(obstacle);
    panObstacle(obstacle2);
    jump(dude.up);
    ctx.drawImage(dude.img, dude.start, 0, dude.width, dude.height, dude.x, dude.y, dude.width, dude.height);    
    if (detectCollision(dude, obstacle) || detectCollision(dude, obstacle2)) {
        gameOver();
    }
};

var jump = function(hasJumped) {
    if (hasJumped) {
        dude.y = Math.floor(dude.y + (dude.vel * time) + (0.5 * dude.acc * time * time));
        time = time + 50; 
        if (dude.y > floor) {
            dude.y = floor;
            time = 0;
            dude.up = false;
        }
    }
}

var panBackground = function(object) {
    object.x = object.x % (width + 1);
    if (object.x < 0) {
        object.x = object.x + width;
    }
    object.x = object.x + object.vel;
    ctx.drawImage(object.img, object.x, object.y, width, height, object.pos[0], object.pos[1], width, height);
}
var panObstacle = function(object) {

    object.x = object.x % (width + 1);
    if (object.x < -50) {
        object.x = object.x + width;
        object.x += Math.floor((Math.random() * 60));
    }

    object.x = object.x - object.vel;
    ctx.drawImage(object.img, object.start, 0, object.width, object.height, object.x, object.y, object.width, object.height);
}

var detectCollision = function(object1, object2) {
    var boolian = false;
    var distance = Math.sqrt(((object1.x - object2.x)*(object1.x - object2.x)) + ((object1.y - object2.y)*(object1.y - object2.y)));
    if (distance <= 50) {
        boolian = true;
    } else if (((object2.x + object2.width) <= (object1.x + 5)) && ((object2.x + object2.width) >= (object1.x - 5))) {
        score = score + 1;
    }
    return boolian;
}

var gameOver = function() {
    clearInterval(play);
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Game Over",((screenWidth / 2) - 80),(height / 3));
    ctx.font = "20px Arial";
    ctx.fillText(score, 15, 30);
    isStopped = true;
}

var resetGame = function() {
    time = 0;
    score = 0;
    dude.up = false;
    dude.x = 50;
    dude.y = floor;
    obstacle.x = width;
    obstacle2.x = width + 350;
    isStopped = false;
    play = setInterval(advanceGame, 50);
}

var keyHandler = function(e) {
    e = e || window.event; 
    if (e.keyCode == '38') {
        dude.up = true;
        e.preventDefault();
    }
};

var clickHandler = function() {
    if (!isStopped) {
        dude.up = true;
        e.preventDefault();
    }
}

var setCanvasSize = function() {
    screenWidth = document.documentElement.clientWidth;
    if (screenWidth < 600) {
        theCanvas.width = screenWidth;
    } else {
        screenWidth = 600;
    }
    advanceGame();
}

var orientationChange = function() {
    clearInterval(play);
    setTimeout(setCanvasSize, 500);
}

window.onload = function () {
    theCanvas = document.getElementById('Canvas1');
    
    if (theCanvas && theCanvas.getContext) {
        ctx = theCanvas.getContext("2d");
        if (ctx) {
            setCanvasSize();
            //Set Event handlers
            var pauseButton = document.getElementById('pause');
            pauseButton.onclick = function() {
                if (!isStopped) {
                    clearInterval(play);
                 }
            };
            var playButton = document.getElementById('play');
            playButton.onclick = function() {
                if (!isStopped) {
                  clearInterval(play);
                  play = setInterval(advanceGame, 50);  
                } else {
                    resetGame();
                }
            };
            document.onkeydown = keyHandler;
            theCanvas.onmousedown = function () { 
                clickHandler(); 
            };
            window.addEventListener('orientationchange', orientationChange, false);
        }
    }
};