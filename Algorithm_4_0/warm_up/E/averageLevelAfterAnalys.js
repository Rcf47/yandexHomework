const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let n = 0;
let ratings = [];
rl.on("line", (input) => {
  if (n === 0) {
    n = Number(input);
  } else {
    ratings = input.split(" ").map(Number);
    if (ratings.length === n) {
      console.log(findAverageLevel(n, ratings));
      rl.close();
    }
  }
});

function findAverageLevel(n, ratings) {
  let sumLowerRating = 0;
  let sumHigherRating = 0;

  let areaHigherRating = 0;
  let areaLowerRating = 0;

  let higherDispleasureLevel = 0;
  let lowerDispleasureLevel = 0;

  let displeasureLevel = [];

  for (let i = 0; i < n; i++) {
    let headman = ratings[i];
    if (i === 0) {
      sumHigherRating = ratings.reduce((a, b) => a + b, 0) - headman;
      areaHigherRating = findAreaHigherRating(n, i, headman);
      higherDispleasureLevel = findHigherDispleasureLevel(
        sumHigherRating,
        areaHigherRating,
      );
      displeasureLevel.push(higherDispleasureLevel);
    } else {
      sumLowerRating = sumLowerRating + ratings[i - 1];
      areaLowerRating = findAreaLowerRating(i, headman);
      lowerDispleasureLevel = findLowerDispleasureLevel(
        sumLowerRating,
        areaLowerRating,
      );

      sumHigherRating = sumHigherRating - headman;
      areaHigherRating = findAreaHigherRating(n, i, headman);
      higherDispleasureLevel = findHigherDispleasureLevel(
        sumHigherRating,
        areaHigherRating,
      );

      displeasureLevel.push(lowerDispleasureLevel + higherDispleasureLevel);
    }
  }
  return displeasureLevel.join(" ");
}

function findAreaHigherRating(n, i, headman) {
  return (n - i - 1) * headman;
}

function findAreaLowerRating(i, headman) {
  return i * headman;
}

function findHigherDispleasureLevel(sum, area) {
  return sum - area;
}

function findLowerDispleasureLevel(sum, area) {
  return area - sum;
}
