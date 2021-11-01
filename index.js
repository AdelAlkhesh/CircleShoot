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

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.drawPlayer();
  projectiles.forEach((ele) => {
    ele.update();
  });

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

addEventListener("click", (event) => {
  const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
  let velocity = {
    x: Math.cos(angle) * 7,
    y: Math.sin(angle) * 7,
  };

  projectiles.push(new Projectile(player.x, player.y, 5, "red", velocity));
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
