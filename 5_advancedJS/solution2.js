module.exports = Sequence;

function Sequence(from, to, step) {
  if (!(this instanceof Sequence)) { return new Sequence(from, to, step); }

  if (typeof from !== 'number' || typeof to !== 'number' || typeof step !== 'number' || step <= 0) { throw new TypeError('Invalid arguments'); }

  this.from = from; this.to = to; this.step = step;
}

Sequence.prototype[Symbol.iterator] = function*() { let current = this.from; while (current <= this.to) { yield current; current += this.step; } };

Sequence.prototype.setStep = function(step) {
  if (typeof step !== 'number' || step <= 0) { throw new TypeError('Invalid step'); }

  this.step = step;
};

Sequence.prototype.constructor = Sequence;

Sequence.prototype[Symbol.toStringTag] = 'SequenceOfNumbers';

Sequence.prototype.toString = function() {
  return `Sequence of numbers from ${this.from} to ${this.to} with step ${this.step}`;
};

Sequence.prototype.valueOf = function() { let length = Math.floor((this.to - this.from) / this.step) + 1; return length; };
