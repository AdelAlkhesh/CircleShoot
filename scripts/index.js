const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let isLeft = false;
let isRight = false;
let isUp = false;
let isDown = false;

let proRadius = 5;

let audio = new Audio("./audio/Sub - Mini Impact-[AudioTrimmer.com] (1).wav");
let backgroundAudio = new Audio("./audio/Sweet baby kicks PSG.mp3");

let difficulty = 2;

let timer = 0;
let speedID = 0;
let cannonID = 0;

letbackgroundColor = `hsl(${Math.random() * 360}, 50%, 50%)`;

canvas.height = innerHeight;
canvas.width = innerWidth;

const x = canvas.width / 2;
const y = canvas.height / 2;
const player = new Player(x, y, 15, "white");

const projectiles = [];
const enemies = [];
const particles = [];
const powerUps = [];
const randomDrops = ['cannon', 'speed', 'health'];
let powerUpDropped = false;


function spawnEnemies() {
  setInterval(() => {
    let health = 0;
    let radius = Math.floor(Math.random() * 40);
    if (radius < 10) {
      radius += 10;
    }
    if (radius > 30) {
      health = 1;
    }
    let x;
    let y;

    if (Math.random() < 0.5) {
      x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
      y = Math.random() * canvas.height;
    } else {
      y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
      x = Math.random() * canvas.width;
    }
    let color1 = Math.random() * 360;
    const color = `hsl(${color1}, 50%, 50%`;
    const angle = Math.atan2(player.y - y, player.x - x);
    let velocity = {
      x: Math.cos(angle) * difficulty,
      y: Math.sin(angle) * difficulty,
    };

    enemies.push(new Enemy(x, y, radius, color, velocity, health));
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
  backgroundAudio.play();
  backgroundAudio.volume = 0.2;

  animationID = requestAnimationFrame(animate);
  ctx.fillStyle = "rgba(0,0,0,0.3";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player.drawPlayer();
  drawScore();
  drawLives();
  drawDifficulty();
  increaseDifficulty();
  playerMovement();
  powerUps.forEach((ele) => {
    ele.update();
  });

  projectiles.forEach((ele) => {
    ele.update();
  });

  particles.forEach((particle, index) => {
    if (particle.alpha <= 0) {
      particles.splice(index, 1);
    } else {
      particle.update();
    }
  });
  enemies.forEach((enemy, index) => {
    enemy.update();
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - enemy.radius - player.radius < 1 && player.lives == 0) {
      backgroundAudio.pause();
      cancelAnimationFrame(animationID);
    } else if (dist - enemy.radius - player.radius < 1 && player.lives > 0) {
      setTimeout(() => {
        player.lives -= 1;
        enemies.splice(index, 1);
      }, 0);
    }
    projectiles.forEach((projectile, proIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      if (dist - enemy.radius - projectile.radius < 1 && enemy.health == 0) {
        let chance = Math.round(Math.random() * 50);
        if (chance == 1 && player.hasPowerUp == false && powerUpDropped == false) {
          powerUpDropped = true;
          powerUps.push(
            new RandomDrops(
              projectile.x,
              projectile.y,
              15,
              randomDrops[Math.floor(Math.random() * randomDrops.length)]
              
            )
          );
        }

        for (let i = 0; i < 8; i++) {
          particles.push(
            new Particle(projectile.x, projectile.y, 3, enemy.color, {
              x: Math.random() - 0.5,
              y: Math.random() - 0.5,
            })
          );
        }
        setTimeout(() => {
          enemies.splice(index, 1);
          projectiles.splice(proIndex, 1);
          player.score += 10;
        }, 0);
      } else if (
        dist - enemy.radius - projectile.radius < 1 &&
        enemy.health > 0
      ) {
        enemy.radius -= 20;
        enemy.health -= 1;
        player.score += 20;
        projectiles.splice(proIndex, 1);
        for (let i = 0; i < 8; i++) {
          particles.push(
            new Particle(projectile.x, projectile.y, 3, enemy.color, {
              x: Math.random() - 0.5,
              y: Math.random() - 0.5,
            })
          );
        }
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

  powerUps.forEach((drop, index) => {
    let powerUpDist = Math.hypot(player.x - drop.x, player.y - drop.y);
    if (
      powerUpDist - drop.radius - player.radius < 1 &&
      drop.name == "health"
    ) {
      player.lives += 1;
      powerUps.splice(index, 1);
    } else if (
      powerUpDist - drop.radius - player.radius < 1 &&
      drop.name == "speed"
    ) {
      player.hasPowerUp = true;
      player.velocity = 5;
      powerUps.splice(index, 1);
      speedID = setInterval(() => {
        timer++;
        if (timer == 20) {
          clearInterval(speedID);
          player.velocity = 3;
          timer = 0;
          player.hasPowerUp = false;
          powerUpDropped = false;
        }
      }, 1000);
    } else if (
      powerUpDist - drop.radius - player.radius < 1 &&
      drop.name == "cannon"
    ) {
      player.hasPowerUp = true;
      proRadius = 30;
      powerUps.splice(index, 1);
      cannonID = setInterval(() => {
        timer++;
        if (timer == 20) {
          clearInterval(cannonID);
          proRadius = 5;
          timer = 0;
          player.hasPowerUp = false;
          powerUpDropped = false;
        }
      }, 1000);
    }
  });
}

function speedUP() {}

function shootProjectile() {
  const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
  let velocity = {
    x: Math.cos(angle) * 10,
    y: Math.sin(angle) * 10,
  };
  projectiles.push(
    new Projectile(player.x, player.y, proRadius, "red", velocity)
  );
}

addEventListener("click", (event) => {
  shootProjectile();
  audio.currentTime = 0;
  audio.play();
  audio.volume = 0.1;
  audio.playbackRate = 1;
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
