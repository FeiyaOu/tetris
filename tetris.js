"use strict";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const bgMusic = document.getElementById("bg-music");
document.addEventListener("DOMContentLoaded", (event) => {
  bgMusic.play();
});

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 30;

let grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
console.log(grid);

let currentShape = {
  shape: [
    [1, 1, 1],
    [1, 1, 0],
  ],
  color: "orange",
};
let posX = 2;
let posY = 0;

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  // ctx.lineWidth = 1;
  //let y=2, because I can not set posY to negative -2, because it is relatited to
  //the index of grid matrix. so I set y=2;
  //to hide the top two rows of grid where the shape is generated.
  for (let y = 1; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (grid[y][x] === 0) {
        ctx.fillStyle = "white";

        // ctx.strokeStyle = "red";
      } else {
        ctx.fillStyle = "lightseagreen";
        // ctx.strokeStyle = "red";
      }
      ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    }
  }
}

function drawShape() {
  for (let y = 0; y < currentShape.shape.length; y++) {
    for (let x = 0; x < currentShape.shape[y].length; x++) {
      if (currentShape.shape[y][x]) {
        ctx.fillStyle = currentShape.color;
        //to draw when the shape drop into the white grid area
        if (posY > 0) {
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
  for (let y = 0; y < currentShape.shape.length; y++) {
    for (let x = 0; x < currentShape.shape[y].length; x++) {
      if (currentShape.shape[y][x]) {
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
    {
      shape: [
        [1, 1, 1],
        [0, 1, 0],
      ],
      color: "#FA5A5A",
    },
    {
      shape: [
        [1, 1],
        [1, 1],
      ],
      color: "#6CC55F",
    },
    {
      shape: [
        [1, 0, 0],
        [1, 1, 1],
      ],
      color: "#C878E6",
    },
    {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
      ],
      color: "#78AAF0",
    },
    { shape: [[1, 1, 1, 1]], color: "#F050BE" },
    {
      shape: [
        [1, 1, 1],
        [1, 1, 0],
      ],
      color: "orange",
    },
  ];
  const n = shapeArray.length;
  currentShape = shapeArray[Math.floor(Math.random() * n)];
  posX = 3;
  posY = 0;
}

const score = document.querySelector(".score");

let scoreUpdated = 0;
function clearLines() {
  for (let y = 0; y < ROWS; y++) {
    if (grid[y].every((cell) => cell === 1)) {
      grid.splice(y, 1);
      grid.unshift(Array(COLS).fill(0));
      scoreUpdated++;
      score.textContent = scoreUpdated * 10;
    }
  }
}

function gameLoop() {
  drawGrid();
  drawShape();
}

const messageBox = document.querySelector(".messages");
const messageAdded = document.createElement("div");
messageAdded.classList.add("message");
messageAdded.classList.add("scoreInfo");
messageAdded.textContent = "Game Over!";
function update() {
  if (!checkCollision(currentShape.shape, posX, posY + 1)) {
    posY++;
  } else if (checkCollision(currentShape.shape, posX, posY)) {
    fixShape();

    messageBox.prepend(messageAdded);
    currentShape = [];
  } else {
    fixShape();
    clearLines();
    generateNewShape();
  }
}

//real actions
function gameRun1() {
  gameLoop();
  update();
}

let intervalId;

function startInverval() {
  intervalId = setInterval(() => {
    gameRun1();
  }, 800);
}

startInverval();
// const updateInterval = setInterval(() => {
//   gameRun1();
// }, 1000);

function restartInterval() {
  if (intervalId) {
    clearInterval(intervalId);
    startInverval();
  }
}

//to move left right and down
document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    rotateShape();
    gameLoop();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.code === "KeyA") {
    rotateShapeAnti();
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
  clearInterval(intervalId);
  bgMusic.pause();
});
//continue;
const btnC = document.querySelector(".continue");
btnC.addEventListener("click", function () {
  restartInterval();
  bgMusic.play();
});

////Restart the game
const btnRe = document.querySelector(".restart");
btnRe.addEventListener("click", function () {
  messageAdded.remove();
  //to set the grid and shape to its original value
  grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  currentShape = {
    shape: [
      [1, 1, 1],
      [1, 1, 0],
    ],
    color: "orange",
  };
  posX = 2;
  posY = 0;
  //loop the game;
  restartInterval();
  bgMusic.play();
});

//when the shapes add up to the top, show message, the game ends, restart
// function gameEnds() {
//   for (let x = 0; x < COLS; x++) {
//     if (grid.every((row) => row[x] === 1)) {
//       alert("Game ends. Restart.");
//     }
//   }
// }

function gameEnds() {
  if (checkCollision(currentShape.shape, posX, posY)) {
    alert("Game ends");
  } else return;
}

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

function rotateMatrixAnti(matrix) {
  const rotated1 = matrix.map((row) => row.reverse());
  const rotated2 = rotated1[0].map((_, index) =>
    rotated1.map((row) => row[index])
  );
  return rotated2;
}

function rotateShapeAnti() {
  const rotatedShape = rotateMatrixAnti(currentShape.shape);
  if (!checkCollision(rotatedShape, posX, posY)) {
    currentShape.shape = rotatedShape;
  }
}

function rotateShape() {
  const rotatedShape = rotateMatrix(currentShape.shape);
  if (!checkCollision(rotatedShape, posX, posY)) {
    currentShape.shape = rotatedShape;
  }
}
//to move left right and down
function moveLeftShape() {
  if (!checkCollision(currentShape.shape, posX - 1, posY)) {
    posX--;
  }
}

function moveRightShape() {
  if (!checkCollision(currentShape.shape, posX + 1, posY)) {
    posX++;
  }
}

function moveDownShape() {
  if (!checkCollision(currentShape.shape, posX, posY + 1)) {
    posY++;
  }
}

//////pause,clearInterval, or set time to very big number.
//continue, when click pause, put current grid and position x,y into variables.
//when continue, put these variable into initial grid and position xy.
//restart, clear grid, all set to 0; clear position x,y.
///end (y all cell===1,then, stop generate new shape,if,click restart, clear y, add new y,)
