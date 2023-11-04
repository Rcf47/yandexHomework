const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (input) => {
  let [xA, yA, xB, yB] = input.split(" ").map(Number);
  rl.close();
  console.log(calculateDistance(xA, yA));
});
const maxDistance = 10 ** 6;
const gridSize = 1000;
const grid = new Array(gridSize);

function calculateDistance(x, y) {
  if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) return maxDistance;
  if (grid[x][y] !== undefined) return grid[x][y];

  const dx = Math.abs(x - xB);
  const dy = Math.abs(y - yB);
  const distance = Math.sqrt(dx * dx + dy * dy);

  grid[x][y] = distance;

  return distance;
}
