/* eslint-disable max-len */
/* eslint-disable no-bitwise */

let step = 0;
let start = false;
let gameOver = false;
const canvasHeight = 400;
const canvasWidth = 400;
const cellSize = 40;
const numberOfLine = (canvasHeight / cellSize) | 0;
const numberOfColumn = (canvasWidth / cellSize) | 0;
const speed = 2;
let candy = null;
const snek = {
  bodyParts: [{
    orientation: 1,
    position: { c: (numberOfColumn / 2) | 0, l: (numberOfLine / 2) | 0 },
  }],
};

// eslint-disable-next-line no-unused-vars
function setup() {
  createCanvas(canvasWidth, canvasHeight);
  background(255, 204, 0);
}

function createBodyPart() {
  const lastBodyPart = snek.bodyParts[snek.bodyParts.length - 1];
  const newBodyPart = JSON.parse(JSON.stringify(lastBodyPart));
  snek.bodyParts[snek.bodyParts.length] = newBodyPart;

  switch (lastBodyPart.orientation) {
    case 0: newBodyPart.position.l += 1; break;
    case 1: newBodyPart.position.c -= 1; break;
    case 2: newBodyPart.position.l -= 1; break;
    case 3: newBodyPart.position.c += 1; break;
    default: break;
  }
}

function isOnSnek(c, l) {
  for (let i = 0; i < snek.bodyParts.length; i += 1) {
    if (snek.bodyParts[i].position.c === c && snek.bodyParts[i].position.l === l) return true;
  }
  return false;
}

function isOutOfBounds(c, l) {
  if (c < 0) return true;
  if (l < 0) return true;
  if (c >= numberOfColumn) return true;
  if (l >= numberOfLine) return true;
  return false;
}

function createCandy() {
  let c = -1;
  let l = -1;
  do {
    c = random(0, numberOfColumn) | 0;
    l = random(0, numberOfLine) | 0;
  } while (isOnSnek(c, l));
  candy = { position: { c, l } };
}

function moveSnek() {
  let heading = -1;
  let willGrow = false;
  for (let i = 0; i < snek.bodyParts.length; i += 1) {
    const bodyPart = snek.bodyParts[i];
    if (i === 0) heading = bodyPart.orientation;
    if (isOutOfBounds(bodyPart.position.c, bodyPart.position.l)) gameOver = true;
    switch (bodyPart.orientation) {
      case 0: bodyPart.position.l -= 1; break;
      case 1: bodyPart.position.c += 1; break;
      case 2: bodyPart.position.l += 1; break;
      case 3: bodyPart.position.c -= 1; break;
      default: break;
    }
    if (i === 0) {
      if (candy && candy.position.c === bodyPart.position.c && candy.position.l === bodyPart.position.l) {
        candy = null;
        willGrow = true;
        createCandy();
      }
    }
    if (i > 0) [bodyPart.orientation, heading] = [heading, bodyPart.orientation];
  }
  if (willGrow) createBodyPart();
}

function drawSnek() {
  for (let i = 0; i < snek.bodyParts.length; i += 1) {
    const bodyPart = snek.bodyParts[i];
    fill(0, 0, 0);
    noStroke();
    rect(bodyPart.position.c * cellSize, bodyPart.position.l * cellSize, cellSize, cellSize);
  }
}

function drawCandy() {
  if (candy) {
    fill(255, 0, 0);
    noStroke();
    rect(candy.position.c * cellSize, candy.position.l * cellSize, cellSize, cellSize);
  }
}

// eslint-disable-next-line no-unused-vars
function keyPressed() {
  switch (keyCode) {
    case UP_ARROW: if (snek.bodyParts[0].orientation !== 2) snek.bodyParts[0].orientation = 0; break;
    case RIGHT_ARROW: if (snek.bodyParts[0].orientation !== 3) snek.bodyParts[0].orientation = 1; break;
    case DOWN_ARROW: if (snek.bodyParts[0].orientation !== 0) snek.bodyParts[0].orientation = 2; break;
    case LEFT_ARROW: if (snek.bodyParts[0].orientation !== 1) snek.bodyParts[0].orientation = 3; break;
    case ENTER: start = !start; break;
    default: break;
  }
}

// eslint-disable-next-line no-unused-vars
function draw() {
  clear();
  background(230);
  if (start && !gameOver) {
    if (step % (60 / speed) === 0) moveSnek(); step += 1;
    if (!candy) createCandy();
  }
  if (gameOver) {
    console.log('Game Over');
  }
  drawSnek();
  drawCandy();
}
