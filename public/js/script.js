// game constants
let lastPaintTIme = 0;

let snakeDirection = { x: 0, y: 0 };
let snakeArr = [{ x: 8, y: 8 }];

let speed = 3;

let score = 0;

let hiscore = 0;
localStorage.setItem("hiscore", hiscore);

let scoreCard = document.getElementById("score");
let speedRange = document.getElementById("speed-range");
speedRange.value = speed;

// Get the modal
let modal = document.getElementById("myModal");
// Get the <p> element that contains modal text
let modalText = document.getElementById("modal-text");
// Get the <span> element that closes the modal
let span = document.getElementsByClassName("close")[0];

speedRange.oninput = function () {
  speed = this.value;
};

// game functions
function main(ctime) {
  window.requestAnimationFrame(main);
  if ((ctime - lastPaintTIme) / 1000 < 1 / speed) {
    return;
  }
  lastPaintTIme = ctime;
  gameEngine();
}

let a = 2;
let b = 13;
function foodGenerator(a, b) {
  let food = {
    x: Math.round(a + (b - a) * Math.random()),
    y: Math.round(a + (b - a) * Math.random()),
  };
  return food;
}

let food = foodGenerator(a, b);

function isCollide(snakeArr) {
  for (let i = 1; i < snakeArr.length; i++) {
    if (snakeArr[i].x === snakeArr[0].x && snakeArr[i].y === snakeArr[0].y) {
      return true;
    }
  }
  if (
    snakeArr[0].x >= 16 ||
    snakeArr[0].x <= 0 ||
    snakeArr[0].y >= 16 ||
    snakeArr[0].y <= 0
  ) {
    return true;
  }
}

function gameEngine() {
  scoreCard.innerHTML = "Score: " + score;
  // Part 0: Moving the snake
  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
  }

  snakeArr[0].x += snakeDirection.x;
  snakeArr[0].y += snakeDirection.y;

  // Part 1A: Updating the snake - Colide
  if (isCollide(snakeArr)) {
    modal.style.display = "block";
    if (score > hiscore) {
      hiscore = score;
      localStorage.setItem("hiscore", hiscore);
      modalText.innerHTML = "New Hiscore: " + hiscore;
    } else {
      modalText.innerHTML = "Your Score: " + score + ", " + "Hiscore: " + hiscore;
    }
    snakeDirection = { x: 0, y: 0 };
    snakeArr = [{ x: 8, y: 8 }];

    // When the user clicks on <span> (x), close the modal
    span.onclick = () => {
      modal.style.display = "none";
      score = 0;
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = (event) => {
      if (event.target == modal) {
        modal.style.display = "none";
        score = 0;
      }
    };
  }

  // Part 1B: Updating the snake - Eating food
  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    snakeArr.unshift({
      x: snakeArr[0].x + snakeDirection.x,
      y: snakeArr[0].y + snakeDirection.y,
    });
    score++;
    scoreCard.innerHTML = "Score: " + score;
    food = foodGenerator(a, b);
  }

  // Part 2: Render the snake
  gameBoard.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) {
      snakeElement.classList.add("snake-head");
    } else {
      snakeElement.classList.add("snake-body");
    }
    gameBoard.appendChild(snakeElement);
  });
  // Part 3: Render the food
  foodElement = document.createElement("div");
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
  gameBoard.appendChild(foodElement);
}

// main game logic
window.requestAnimationFrame(main);
window.addEventListener("keydown", (e) => {
  if (modal.style.display != "block") {
    switch (e.key) {
      case "ArrowUp":
        snakeDirection = { x: 0, y: -1 };
        break;
      case "ArrowDown":
        snakeDirection = { x: 0, y: 1 };
        break;
      case "ArrowRight":
        snakeDirection = { x: 1, y: 0 };
        break;
      case "ArrowLeft":
        snakeDirection = { x: -1, y: 0 };
        break;
      default:
        break;
    }
  }
});
