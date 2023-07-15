module.exports = Sequence;

function Sequence(from, to, step) {
  if (!(this instanceof Sequence)) {
    return new Sequence(from, to, step);
  }

  let currentValue = from;
  let iterationCount = Math.ceil((to - from) / step);

  this[Symbol.iterator] = function*() {
    for (let i = 0; i <= iterationCount; i++) {
      yield currentValue;
      currentValue += step;
    }
  };

  this.setStep = function(newStep) {
    step = newStep;
    iterationCount = Math.ceil((to - currentValue) / step);
    return step;
  };

  this.valueOf = function() {
    return currentValue;
  };

  this.toString = function() {
    return 'Sequence of numbers from ' + from + ' to ' + to + ' with step ' + step;
  };
}

let sequence = Sequence(0, 10, 1)

console.log(Object.prototype.toString.call(sequence))

