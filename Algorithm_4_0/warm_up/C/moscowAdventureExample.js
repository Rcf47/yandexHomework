const { parse } = require("path");
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
  const thetaA = Math.atan2(yA, xA);
  const thetaB = Math.atan2(yB, xB);
  const deltaTheta = Math.abs(thetaA - thetaB);
  let result;

  if (rA < rB) {
    result = rA + Math.min(rB - rA, rA * deltaTheta);
  } else {
    result = rB + Math.min(rA - rB, rB * deltaTheta);
  }
  return Number.parseFloat(result.toFixed(6));
}
