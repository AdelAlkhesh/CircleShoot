const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let isLeft = false;
let isRight = false;
let isUp = false;
let isDown = false;

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
      x: Math.cos(angle) * 3,
      y: Math.sin(angle) * 3,
    };

    enemies.push(new Enemy(x, y, radius, color, velocity));
  }, 1000);
}

function playerMovement() {
  if (isRight) {
    player.x += player.velocity;
  }
  if (isLeft) {
    player.x -= player.velocity;
  }
  if (isUp) {
    player.y -= player.velocity;
  }
  if (isDown) {
    player.y += player.velocity;
  }
}
let animationID;
function animate() {
  animationID = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.drawPlayer();
  projectiles.forEach((ele) => {
    ele.update();
  });
  playerMovement();
  enemies.forEach((enemy, index) => {
    enemy.update();
    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
    if (dist - enemy.radius - player.radius < 1) {
      cancelAnimationFrame(animationID);
    }
    projectiles.forEach((ele, proIndex) => {
      const dist = Math.hypot(ele.x - enemy.x, ele.y - enemy.y);
      if (dist - enemy.radius - ele.radius < 1) {
        setTimeout(() => {
          enemies.splice(index, 1);
          projectiles.splice(proIndex, 1);
        }, 0);
      }
    });
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
