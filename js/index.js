class Button {
  constructor(screenWidth, screenHeight) {
    this.canClick = true;
    this.radius = 20;
    this.pos = {
      x: Math.random() * (screenWidth - 100) + 50,
      y: Math.random() * (screenHeight - 100) + 50
    };
  }
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }
}


class InputHandler {
  constructor() {
    document.addEventListener("mousedown", (event) => {
      let insideCanvas = canvas.contains(event.target);
      if(insideCanvas) {
        if(game) {
          if (((event.pageX - canvas.getBoundingClientRect().left + button.radius/2 -(button.pos.x + button.radius/2)) ** 2 +
              ((event.pageY - canvas.getBoundingClientRect().top - window.scrollY + button.radius/2) - (button.pos.y + button.radius/2)) ** 2)
               ** 0.5 < button.radius) {
            button.pos = {
              x: Math.random() * (GAME_WIDTH - 100) + 50,
              y: Math.random() * (GAME_HEIGHT - 100) + 50
            };
            score++;
          } else {
            score--;
            refreshTimer = 0;
          }
        } else if(menu) {
          game = true;
          menu = false;
        } else if(end) {
          if(restartBuffer >= RESTART_BUFFER_END) {
            end = false;
            game = true;
            score = 0;
            timer = 0;
          }
        }
        console.log(canvas.getBoundingClientRect().y)
      }
    });
  }
}


let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");

const GAME_WIDTH = 1080;
const GAME_HEIGHT = 720;

menu = true;
game = false;
end = false;

let score = 0;
let bestScore = 0;

const TIMER_END = 3650;
let timer = 0;

const REFRESH_TIMER_END = 20;
let refreshTimer = REFRESH_TIMER_END;

const RESTART_BUFFER_END = 40;
let restartBuffer = RESTART_BUFFER_END;

let button = new Button(GAME_WIDTH, GAME_HEIGHT);
new InputHandler(button, GAME_WIDTH, GAME_HEIGHT);

function gameLoop(timestamp) {
  console.log(canvas.getBoundingClientRect().left);

  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  if (refreshTimer >= 20) {ctx.fillStyle = "#2c2f33"}
  else {ctx.fillStyle = "#a21441"}
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  if(game) {
    if(timer >= TIMER_END) {
      game = false;
      end = true;
      restartBuffer = 0;
      if(score > bestScore) {
        bestScore = score;
      }
    } else {
      timer++
    }

    if(refreshTimer < REFRESH_TIMER_END) {refreshTimer++}

    if (refreshTimer >= 20) {ctx.fillStyle = "#23272a"}
    else {ctx.fillStyle = "#dc143c"}
    ctx.textAlign = "left";
    ctx.font = "100px Impact"
    ctx.fillText(Math.floor(timer/60).toString(10),30,100);
    ctx.textAlign = "center";
    ctx.font = "250px Impact"
    ctx.fillText(score.toString(10),GAME_WIDTH/2, 460)

    button.draw(ctx);

  } else if(menu) {
    ctx.fillStyle = "#23272a";
    ctx.textAlign = "center";
    ctx.font = "150px Impact"
    ctx.fillText("Click to start",GAME_WIDTH/2, 400);

  } else if(end) {

    if(restartBuffer < RESTART_BUFFER_END) {restartBuffer++}

    ctx.fillStyle = "#23272a";
    ctx.textAlign = "center";
    ctx.font = "150px Impact"
    ctx.fillText("Click to retry",GAME_WIDTH/2, 600);
    ctx.font = "250px Impact"
    ctx.fillText(score.toString(10),GAME_WIDTH/2, 380)
    ctx.textAlign = "left";
    ctx.font = "100px Impact"
    ctx.fillText("Best: " + bestScore.toString(10),30,100);
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
