document.addEventListener('DOMContentLoaded', initializeApp);
document.addEventListener('keyup', moveSnake);

var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');

var sizeOfSpacesOnBoard = 15;
var boardWidth = 300;
var boardHeight = 450;

var foodX = 0;
var foodY = 0;

var score = 0;
var count = 0;

var snake = {
    size: sizeOfSpacesOnBoard,
    direction:{
        // how far to travel
        x: sizeOfSpacesOnBoard,
        y: 0,
    },
            // starting position
    blocks: [{x:15, y: 15}, {x:15*2, y: 15}, {x:15*3, y:15}],
    updateDirection: function(x, y){
        // Our direction is dictated by the board space size
        // example arg: (-1, 0)
        this.direction.x = this.size * x;
        this.direction.y = this.size * y;
    }
};

var gameLoop = null;

function initializeApp(){
    document.body.append(canvas);
    canvas.style.background = '#0c0032';
    canvas.style.border = '5px solid #3500D3';
    canvas.width = boardWidth;
    canvas.height = boardHeight;
    createFood();
    drawSnake();
    gameLoop = setInterval(updateGame, 80);
}

/* Main game loop */
function updateGame() {
    document.querySelector('#score').innerHTML = score;
    clearCanvas();

    // record where current head is
    var headOfSnake = { x: snake.blocks[0].x, y: snake.blocks[0].y }

    // move the head in the direction the snake is going
    headOfSnake.x += snake.direction.x;
    headOfSnake.y += snake.direction.y;

    // add it to the front of the array of body parts
    snake.blocks.unshift(headOfSnake);
    snake.blocks.pop();


    drawSnake();
    drawFood(foodX, foodY);

    if(snake.blocks[0].x === foodX && snake.blocks[0].y === foodY){
        score++;
        addToSnake();
        createFood();
    }

    if(count > 1 && isGameOver()){
       clearInterval(gameLoop);
       document.querySelector('#final-score').innerHTML = score;
       document.querySelector('.game-over').classList.remove('hidden');
    }
    count++;
}

function isGameOver(){
    for (var i = 1; i < snake.blocks.length; i++) {
        if (snake.blocks[i].x === snake.blocks[0].x && snake.blocks[i].y === snake.blocks[0].y) {
            return true;
        }
    }

    if(snake.blocks[0].x === canvas.width){
        return true;
    }
    else if(snake.blocks[0].y === canvas.height){
        return true;
    }
    else if (snake.blocks[0].x < 0 || snake.blocks[0].y < 0){
        return true;
    }
    return false;
}

/* Place food randomly on the game board */
function createFood(){
    var validSpace = false;
    do{ // Make sure food doesn't appear on the snakes body
        validSpace = true;
        foodX = randNum(canvas.width / sizeOfSpacesOnBoard, sizeOfSpacesOnBoard);
        foodY = randNum(canvas.height / sizeOfSpacesOnBoard, sizeOfSpacesOnBoard);
        for(var i = 0; i < snake.blocks.length; i++){
            if(snake.blocks[i].x === foodX && snake.blocks[i].y === foodY){
                validSpace = false;
            }
        }
    }while(!validSpace);
}

function drawFood(x, y){
    createRect(x, y, sizeOfSpacesOnBoard, '#ff0000', 'white');
}

function addToSnake() {
    snake.blocks.push({ x: sizeOfSpacesOnBoard, y: sizeOfSpacesOnBoard * 5 });
}
function drawSnake(){
    for(var i = 0; i < snake.blocks.length; i++){
        createRect(snake.blocks[i].x, snake.blocks[i].y, sizeOfSpacesOnBoard, 'limegreen', 'white');
    }
}

function moveSnake(input){
    if (input.code === 'ArrowLeft' && snake.direction.x === 0){
            snake.updateDirection(-1, 0);
    }
    else if(input.code === 'ArrowUp' && snake.direction.y === 0){
        snake.updateDirection(0, -1);
    }
    else if (input.code === 'ArrowRight' && snake.direction.x === 0){
        snake.updateDirection(1, 0);
    }
    else if (input.code === 'ArrowDown' && snake.direction.y === 0){
        snake.updateDirection(0, 1);
    }
}

/* Helpers */
function clearCanvas() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
}
function createRect(x, y, size, fill, stroke) {
    context.beginPath();
    context.fillStyle = fill;
    context.strokeStyle = stroke;
    context.lineWidth = 1;
    context.fillRect(x, y, size, size);
    context.strokeRect(x, y, size, size);
    context.closePath();
}
function randNum(max, sizeOfSpaces){
    return Math.floor(Math.random() * max) * sizeOfSpaces;
}
