"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
console.log(grid);

let currentShape = [
  [1, 1, 1],
  [1, 1, 0],
];
let posX = 2;
let posY = 0;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x] === 0) {
        ctx.fillStyle = "white";
        // ctx.strokeStyle = "red";
      } else {
        ctx.fillStyle = "blue";
        // ctx.strokeStyle = "red";
      }
      ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
  }
}

function drawShape() {
  for (let y = 0; y < currentShape.length; y++) {
    for (let x = 0; x < currentShape[y].length; x++) {
      if (currentShape[y][x]) {
        ctx.fillStyle = "blue";
        ctx.fillRect(
          (posX + x) * BLOCK_SIZE,
          (posY + y) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
        ctx.strokeRect(
          (posX + x) * BLOCK_SIZE,
          (posY + y) * BLOCK_SIZE,
          BLOCK_SIZE,
          BLOCK_SIZE
        );
      }
    }
  }
}

function checkCollision(shape, offsetX, offsetY) {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x]) {
        let newY = y + offsetY;
        let newX = x + offsetX;

        if (newY >= ROWS || newX < 0 || newX >= COLS || grid[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
}

function fixShape() {
  for (let y = 0; y < currentShape.length; y++) {
    for (let x = 0; x < currentShape[y].length; x++) {
      if (currentShape[y][x]) {
        grid[posY + y][posX + x] = 1;
      }
    }
  }
}

// function generateNewShape() {
//   currentShape = [
//     [1, 1, 1],
//     [0, 1, 0],
//   ];
//   posX = 3;
//   posY = 0;
// }

///////////////
//to generage different shape
///////////////////
function generateNewShape() {
  const shapeArray = [
    [
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [1, 1, 1],
      [1, 1, 1],
    ],
    [
      [1, 0, 0, 0],
      [1, 1, 1, 1],
    ],
  ];
  const n = shapeArray.length;
  currentShape = shapeArray[Math.floor(Math.random() * n)];
  posX = 3;
  posY = 0;
}

function clearLines() {
  for (let y = 0; y < ROWS; y++) {
    if (grid[y].every((cell) => cell === 1)) {
      grid.splice(y, 1);
      grid.unshift(Array(COLS).fill(0));
    }
  }
}

function update() {
  if (!checkCollision(currentShape, posX, posY + 1)) {
    posY++;
  } else {
    fixShape();
    clearLines();
    generateNewShape();
  }
}

function gameLoop() {
  drawGrid();
  drawShape();
}
//real actions
function gameRun1() {
  gameLoop();
  update();
}

const updateInterval = setInterval(() => {
  gameRun1();
}, 3000);

//to move left right and down
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    rotateShape();
    gameLoop();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    moveLeftShape();
    gameLoop();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowRight") {
    moveRightShape();
    gameLoop();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowDown") {
    moveDownShape();
    gameLoop();
  }
});
// to pause the game
const btnP = document.querySelector(".pause");
// const btnC = document.querySelector(".continue");
btnP.addEventListener("click", function () {
  clearInterval(updateInterval);
});

// btnC.addEventListener("click", function () {
//   setInterval(() => {
//     update();
//     gameLoop();
//   }, 1000);
// });

function rotateMatrix(matrix) {
  const rotated = matrix[0].map((_, index) =>
    matrix.map((row) => row[index]).reverse()
  );
  return rotated;
}

function rotateShape() {
  const rotatedShape = rotateMatrix(currentShape);
  if (!checkCollision(rotatedShape, posX, posY)) {
    currentShape = rotatedShape;
  }
}
//to move left right and down
function moveLeftShape() {
  if (!checkCollision(currentShape, posX - 1, posY)) {
    posX--;
  }
}

function moveRightShape() {
  if (!checkCollision(currentShape, posX + 1, posY)) {
    posX++;
  }
}

function moveDownShape() {
  if (!checkCollision(currentShape, posX, posY + 1)) {
    posY++;
  }
}

//////pause,clearInterval, or set time to very big number.
//continue, when click pause, put current grid and position x,y into variables.
//when continue, put these variable into initial grid and position xy.
//restart, clear grid, all set to 0; clear position x,y.
///end (y all cell===1,then, stop generate new shape,if,click restart, clear y, add new y,)
