const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let gameRunning = true;

// Player spaceship
let ship = {
  x: 50,
  y: canvas.height / 2,
  size: 20,
  speed: 4
};

// Stars (collectibles)
let pellets = [];
for (let i = 0; i < 10; i++) {
  pellets.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 6
  });
}

// Enemies
let enemies = [];
function spawnEnemy() {
  enemies.push({
    x: canvas.width + 20,
    y: Math.random() * canvas.height,
    size: 20,
    speed: 2 + Math.random() * 2
  });
}
setInterval(spawnEnemy, 2000);

// Movement
let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update() {
  if (!gameRunning) return;

  // Move ship
  if (keys["ArrowUp"]) ship.y -= ship.speed;
  if (keys["ArrowDown"]) ship.y += ship.speed;
  if (keys["ArrowLeft"]) ship.x -= ship.speed;
  if (keys["ArrowRight"]) ship.x += ship.speed;

  // Keep inside canvas
  ship.x = Math.max(0, Math.min(canvas.width - ship.size, ship.x));
  ship.y = Math.max(0, Math.min(canvas.height - ship.size, ship.y));

  // Move enemies
  enemies.forEach(enemy => {
    enemy.x -= enemy.speed;

    // Collision with player
    if (Math.abs(enemy.x - ship.x) < 20 && Math.abs(enemy.y - ship.y) < 20) {
      endGame();
    }
  });

  // Remove off-screen enemies
  enemies = enemies.filter(e => e.x > -50);

  // Collect pellets
  pellets.forEach((p, i) => {
    if (Math.abs(p.x - ship.x) < 15 && Math.abs(p.y - ship.y) < 15) {
      score += 10;
      document.getElementById("score").innerText = "Score: " + score;

      // Respawn pellet
      pellets[i] = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 6
      };
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw pellets
  ctx.fillStyle = "yellow";
  pellets.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw enemies
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw spaceship
  ctx.fillStyle = "#6a5acd";
  ctx.beginPath();
  ctx.moveTo(ship.x, ship.y);
  ctx.lineTo(ship.x - 20, ship.y + 10);
  ctx.lineTo(ship.x - 20, ship.y - 10);
  ctx.closePath();
  ctx.fill();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameRunning = false;
  document.getElementById("gameOver").classList.remove("hidden");
}

function restartGame() {
  score = 0;
  enemies = [];
  pellets = [];
  for (let i = 0; i < 10; i++) {
    pellets.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 6
    });
  }
  ship.x = 50;
  ship.y = canvas.height / 2;
  gameRunning = true;
  document.getElementById("score").innerText = "Score: 0";
  document.getElementById("gameOver").classList.add("hidden");
}

gameLoop();
