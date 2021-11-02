const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let isLeft = false;
let isRight = false;
let isUp = false;
let isDown = false;

let difficulty = 2;

canvas.height = innerHeight;
canvas.width = innerWidth;

const x = canvas.width / 2;
const y = canvas.height / 2;
const player = new Player(x, y, 30, "blue");

const projectiles = [];
const enemies = [];

function spawnEnemies() {
  setInterval(() => {
    const radius = 30;
    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      y = x = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
      x = Math.random() * canvas.width;
    }
    const color = "green";
    const angle = Math.atan2(player.y - y, player.x - x);
    let velocity = {
      x: Math.cos(angle) * difficulty,
      y: Math.sin(angle) * difficulty,
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 600);
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "30px Ariel";
  ctx.fillText(`Score: ${player.score}`, 10, 30);
}

function drawLives() {
  ctx.fillStyle = "white";
  ctx.font = "30px Ariel";
  ctx.fillText(`Lives : ${player.lives}`, 10, 70);
}

function drawDifficulty() {
  ctx.fillStyle = "white";
  ctx.font = "30px Ariel";
  ctx.fillText(`Difficulty : ${difficulty}`, 10, 110);
}

function increaseDifficulty() {
  if (player.score > 500 && player.score < 1000 && difficulty < 2.5) {
    difficulty += 0.5;
  }
  if (player.score > 1000 && player.score < 1500 && difficulty < 3) {
    difficulty += 0.5;
  }
  if (player.score > 1500 && player.score < 2500 && difficulty < 4) {
    difficulty++;
  }
  if (player.score > 2500 && player.score < 3000 && difficulty < 5) {
    difficulty++;
  }
  if (player.score > 3000 && player.score < 5000 && difficulty < 7) {
    difficulty += 2;
  }
}

function playerMovement() {
  if (isRight && player.x + player.radius < canvas.width) {
    player.x += player.velocity;
  }
  if (isLeft && player.x - player.radius > 0) {
    player.x -= player.velocity;
  }
  if (isUp && player.y - player.radius > 0) {
    player.y -= player.velocity;
  }
  if (isDown && player.y + player.radius < canvas.height) {
    player.y += player.velocity;
  }
}
let animationID;
function animate() {
  animationID = requestAnimationFrame(animate);
  ctx.fillStyle = 'rgba(0,0,0,0.3'
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.drawPlayer();
  drawScore();
  drawLives();
  drawDifficulty();
  increaseDifficulty();
  projectiles.forEach((ele) => {
    ele.update();
  });
  // spawnEnemies()
  playerMovement();
  enemies.forEach((enemy, index) => {
    enemy.update();
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - enemy.radius - player.radius < 1 && player.lives == 0) {
      cancelAnimationFrame(animationID);
    } else if (dist - enemy.radius - player.radius < 1 && player.lives > 0) {
      setTimeout(() => {
        player.lives -= 1;
        enemies.splice(index, 1);
      }, 0);
    }
    projectiles.forEach((ele, proIndex) => {
      const dist = Math.hypot(ele.x - enemy.x, ele.y - enemy.y);
      if (dist - enemy.radius - ele.radius < 1) {
        setTimeout(() => {
          enemies.splice(index, 1);
          projectiles.splice(proIndex, 1);
          player.score += 10;
        }, 0);
      }
    });
  });
  projectiles.forEach((ele, proIndex) => {
    if (ele.x + ele.radius > canvas.width) {
      setTimeout(() => {
        projectiles.splice(proIndex, 1);
      });
    }
    if (ele.x - ele.radius < 0) {
      setTimeout(() => {
        projectiles.splice(proIndex, 1);
      });
    }
    if (ele.y + ele.radius > canvas.height) {
      setTimeout(() => {
        projectiles.splice(proIndex, 1);
      });
    }
    if (ele.y - ele.radius < 0) {
      setTimeout(() => {
        projectiles.splice(proIndex, 1);
      });
    }
  });
}
let mouse = false;
function shootProjectile() {
  if (mouse) {
    const angle = Math.atan2(
      event.clientY - player.y,
      event.clientX - player.x
    );
    let velocity = {
      x: Math.cos(angle) * 10,
      y: Math.sin(angle) * 10,
    };
    projectiles.push(new Projectile(player.x, player.y, 5, "red", velocity));
  }
}

addEventListener("mousedown", (event) => {
  mouse = true;
  shootProjectile();
  console.log(projectiles);
});

addEventListener("mouseup", (event) => {
  mouse = false;
});

addEventListener("keydown", (event) => {
  if (event.key == "a") {
    isLeft = true;
  }
  if (event.key == "d") {
    isRight = true;
  }
  if (event.key == "w") {
    isUp = true;
  }
  if (event.key == "s") {
    isDown = true;
  }
});

addEventListener("keyup", (event) => {
  if (event.key == "a") {
    isLeft = false;
  }
  if (event.key == "d") {
    isRight = false;
  }
  if (event.key == "w") {
    isUp = false;
  }
  if (event.key == "s") {
    isDown = false;
  }
});
animate();

spawnEnemies();
increaseDifficulty();
