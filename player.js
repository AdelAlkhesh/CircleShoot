class Player {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.rarius = radius;
    this.color = color;
    this.velocity = 3;
    this.angle = 1;
  }

  drawPlayer() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.rarius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }
}
