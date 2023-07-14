function Sequence(from, to, step) {
  if (!(this instanceof Sequence)) {
    return new Sequence(from, to, step);
  }

  this.from = from;
  this.to = to;
  this.step = step;
}

Sequence.prototype[Symbol.iterator] = function*() {
  for (let i = this.from; i <= this.to; i += this.step) {
    yield i;
  }
};

Sequence.prototype.toString = function() {
  return `Sequence of numbers from ${this.from} to ${this.to} with step ${this.step}`;
};

Sequence.prototype.valueOf = function() {
  return Math.ceil((this.to - this.from) / this.step) + 1;
};

Sequence.prototype.setStep = function(step) {
  this.step = step;
};

module.exports = Sequence;
