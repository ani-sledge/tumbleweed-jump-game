"use strict";
// DOM Elements
var window;
var document;
var background = document.getElementById("canvas");
var playerImg = document.getElementById("player");
var obImg = document.getElementById("obstacles");

// Canvas Display
var theCanvas;
var ctx;
var screenWidth = 600;
var width = 600;
var height = 200;
var floor = 130;

// Game Status
var play;
var score = 0;
var isStopped = true;

// Moving Objects
var player = { x: 50, y: floor, t: 0, up: false, img: playerImg, width: 50, height: 50, start: 0 };
var obstacle = { x: width, y: floor, vel: 10, img: obImg, width: 50, height: 50, start: 0 }; 
var obstacle2 = { x: (width + 300), y: 130, vel: 10, img: obImg, width: 50, height: 50, start: 50 }; 
var background = {x: 0, y: 0, vel: 2, img: background, width: width, height: height, pos: [0,20] };

/**
 * Increment the game by one frame
 */
var advanceGame = function() {
    ctx.clearRect(0,0,width,height);

    // Update position
    player.start = player.start + 50;
    if (player.start >= 150) {
        player.start = 0;
    }
    jump();
    panBackground(background);
    panObstacle(obstacle);
    panObstacle(obstacle2);
    
    ctx.drawImage(player.img, player.start, 0, player.width, player.height, player.x, player.y, player.width, player.height);    
    
    // Detect collisions
    if (detectCollision(player, obstacle) || detectCollision(player, obstacle2)) {
        gameOver();
    }
};

/**
 * Moves the player in a jumping arc
 */
var jump = function() {
    if (player.up) {
        player.t += 1;

        player.y += 0.5*player.t*player.t - 5.75*player.t;
        if (player.y > floor) {
            player.y = floor;
            player.t = 0;
            player.up = false;
        }
    }
}

/**
 * Moves the background image with wrapping
 * @param { object } object - Background image object with x, y, pos[0, 1], and img properties
 */
var panBackground = function(object) {
    object.x = object.x % (width + 1);
    if (object.x < 0) {
        object.x = object.x + width;
    }
    object.x = object.x + object.vel;
    ctx.drawImage(object.img, object.x, object.y, width, height, object.pos[0], object.pos[1], width, height);
}

/**
 * Moves an obstacle with wrapping and a random offset
 * @param { object } object - Obstacle object with x, y, width, height, start, and img properties
 */
var panObstacle = function(object) {
    object.x = object.x % (width + 1);
    if (object.x < -50) {
        object.x = object.x + width;
        object.x += Math.floor((Math.random() * 60));
    }

    object.x = object.x - object.vel;
    ctx.drawImage(object.img, object.start, 0, object.width, object.height, object.x, object.y, object.width, object.height);
}

/** 
 * Calculates the distance between two point objects
 * @param { object } point1 - An object with x and y properties
 * @param { object } point2 - An object with x and y properties
 */
function distance(point1, point2) {
    return Math.sqrt(((point1.x - point2.x)*(point1.x - point2.x)) + ((point1.y - point2.y)*(point1.y - point2.y)));
}

/**
 * Checks if two objects occupy the same space
 * @param { object } object - An object with x, y, and width properties
 * @param { object } obstacle- An object with x, y, and width properties
 */
var detectCollision = function(object, obstacle) {
    var distanceBetweenObjects = distance(object, obstacle);
    var objectPassedObstacle = ((obstacle.x + obstacle.width) <= (object.x + 5)) && ((obstacle.x + obstacle.width) >= (object.x - 5));
    
    if (distanceBetweenObjects <= 50) {
        return true;
    } else if (objectPassedObstacle) {
        score = score + 1;
    }
    return false;
}

/**
 * Displays a game over message on the canvas.
 */
var gameOver = function() {
    clearInterval(play);
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Game Over",((screenWidth / 2) - 80),(height / 3));
    ctx.font = "20px Arial";
    ctx.fillText(score, 15, 30);
    isStopped = true;
}

/**
 * Returns the game and player to the initial settings.
 */
var resetGame = function() {
    score = 0;
    player.up = false;
    player.x = 50;
    player.y = floor;
    obstacle.x = width;
    obstacle2.x = width + 350;
    isStopped = false;
    play = setInterval(advanceGame, 50);
}

/**
 * Moves the player up when the UP ARROW is pressed on the keyboard
 * @param {event} e - a keyboard event
 */
var keyHandler = function(e) {
    e = e || window.event; 
    if (e.keyCode == '38') {
        player.up = true;
        e.preventDefault();
    }
};

/**
 * Moves the player up when the canvas is clicked
 */
var clickHandler = function() {
    if (!isStopped) {
        player.up = true;
        e.preventDefault();
    }
}

/**
 * Adjusts the canvas's width to fit on mobile screens
 */
var setCanvasSize = function() {
    screenWidth = document.documentElement.clientWidth;
    if (screenWidth < 600) {
        theCanvas.width = screenWidth;
    } else {
        screenWidth = 600;
    }
    advanceGame();
}

/**
 * Adjusts the canvas's width when a mobile devices' orientation changes
 */
var orientationChange = function() {
    clearInterval(play);
    setTimeout(setCanvasSize, 500);
}

window.onload = function () {
    // Initialize the HTML5 Canvas
    theCanvas = document.getElementById('Canvas1');
    if (theCanvas && theCanvas.getContext) {
        ctx = theCanvas.getContext("2d");
        if (ctx) {
            setCanvasSize();
            window.addEventListener('orientationchange', orientationChange, false);

            // Set Pause event handler
            var pauseButton = document.getElementById('pause');
            pauseButton.onclick = function() {
                if (!isStopped) {
                    clearInterval(play);
                 }
            };
            // Set Play event handler
            var playButton = document.getElementById('play');
            playButton.onclick = function() {
                if (!isStopped) {
                  clearInterval(play);
                  play = setInterval(advanceGame, 50);  
                } else {
                    resetGame();
                }
            };

            // Set the Jump event handlers
            document.onkeydown = keyHandler;
            theCanvas.onmousedown = function () { 
                clickHandler(); 
            };
        }
    }
};