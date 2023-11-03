const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let N, M;
const sequence = [];
const queries = [];
let inputStage = 0;
rl.on("line", (input) => {
  if (inputStage === 0) {
    [N, M] = input.split(" ").map(Number);
    inputStage++;
  } else if (inputStage === 1) {
    sequence.push(...input.split(" ").map(Number));
    inputStage++;
  } else if (inputStage === 2) {
    const [L, R] = input.split(" ").map(Number);
    queries.push([L, R]);
    if (queries.length === M) {
      rl.close();
      queryHandler(sequence, queries);
    }
  }
});
function findNotMin(sequence, L, R) {
  const subsequence = sequence.slice(L, R + 1);
  const min = Math.min(...subsequence);
  for (let i = 0; i < subsequence.length; i++) {
    if (subsequence[i] !== min) {
      return subsequence[i];
    }
  }
  return "NOT FOUND";
}

function queryHandler(sequence, queries) {
  for (let i = 0; i < queries.length; i++) {
    const [L, R] = queries[i];
    const result = findNotMin(sequence, L, R);
    console.log(result);
  }
}
