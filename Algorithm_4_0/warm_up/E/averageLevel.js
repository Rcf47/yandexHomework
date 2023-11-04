const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let n = 0;
let rating = [];
rl.on("line", (input) => {
  if (n === 0) {
    n = Number(input);
  } else {
    rating = input.split(" ").map(Number);
    const result = averageLevel(n, rating);
    console.log(result.join(" "));
    rl.close();
  }
});

function averageLevel(n, rating) {
  let result = [];
  for (let i = 0; i < n; i++) {
    let totalDiscontent = 0;
    for (let j = 0; j < n; j++) {
      totalDiscontent += Math.abs(rating[j] - rating[i]);
    }
    result.push(totalDiscontent);
  }
  return result;
}
