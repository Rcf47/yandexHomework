const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let inputs = [];
rl.on("line", (input) => {
  inputs.push(input);
  if (inputs.length === 2) {
    console.log(isAnogramm(inputs[0], inputs[1]));
    rl.close();
  }
});

function isAnogramm(str1, str2) {
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();

  if (str1.length !== str2.length) {
    return "NO";
  }

  let sortedStr1 = str1.split("").sort().join("");
  let sortedStr2 = str2.split("").sort().join("");

  return sortedStr1 === sortedStr2 ? "YES" : "NO";
}
