const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (input) => {
  let [xA, yA, xB, yB] = input.split(" ").map(Number);
  rl.close();
  console.log(shortestPath(xA, yA, xB, yB));
});

function shortestPath(xA, yA, xB, yB) {
  const rA = Math.hypot(xA, yA);
  const rB = Math.hypot(xB, yB);
  let theta = Math.acos((xA * xB + yA * yB) / (rA * rB));

  // Если угол больше 180 градусов, двигаемся в обратном направлении
  if (theta > Math.PI) {
    theta = 2 * Math.PI - theta;
  }

  if (rA < rB) {
    return parseFloat((rA + Math.min(rB - rA, rA * theta)).toFixed(9));
  } else {
    return parseFloat((rB + Math.min(rA - rB, rB * theta)).toFixed(9));
  }
}
