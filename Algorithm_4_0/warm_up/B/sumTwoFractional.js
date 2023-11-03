const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (input) => {
  let [a, b, c, d] = input.split(" ").map(Number);
  rl.close();
  sumTwoFractional(a, b, c, d);
});

function sumTwoFractional(a, b, c, d) {
  let numerator = a * d + c * b;
  let denominator = b * d;

  let getCommonDenominator = getDenominator(numerator, denominator);

  let m = numerator / getCommonDenominator;
  let n = denominator / getCommonDenominator;

  console.log(m, n);
}

function getDenominator(num1, num2) {
  while (num2 != 0) {
    let temp = num2;
    num2 = num1 % num2;
    num1 = temp;
  }
  return num1;
}
