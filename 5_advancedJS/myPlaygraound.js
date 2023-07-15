const assert = require('assert');

function Sequence(start, end, step) {
  let currentValue = start;

  function* sequenceGenerator() {
    while (currentValue <= end) {
      yield currentValue;
      currentValue += step;
    }
  }

  const sequence = sequenceGenerator();

  Object.defineProperty(sequence, 'setStep', {
    value: function(newStep) {
      step = newStep;
      return step;
    },
    writable: false,
    enumerable: false,
    configurable: false
  });

  Object.defineProperty(sequence, 'toString', {
    value: function() {
      return `Sequence of numbers from ${start} to ${end} with step ${step}`;
    },
    writable: false,
    enumerable: false,
    configurable: false
  });

  return sequence;
}

// Работает в цикле for-of
let sequence = Sequence(5, -5, 1);

let result = [];
for (const item of sequence) {
  result.push(item);
}

assert.deepEqual([5, 4, 3, 2, 1, 0, -1, -2, -3, -4, -5], result);


// Работает деструктуризация последовательности
assert.deepEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [...Sequence(0, 10, 1)]);


// Работает метод setStep
sequence = Sequence(0, 10, 2);
let iterator = sequence[Symbol.iterator]();

iterator.next();
iterator.next();
sequence.setStep(4);

assert.strictEqual(Number(sequence), 3);
assert.strictEqual(String(sequence), 'Sequence of numbers from 2 to 10 with step 4');
assert.deepEqual([2, 6, 10], [...sequence]);


// Скрыты лишние свойства и методы
sequence = Sequence(0, 10, 1);

assert.deepEqual(Object.getOwnPropertyNames(sequence), []);
assert.deepEqual(Object.getOwnPropertyNames(Sequence.prototype).sort(), ['constructor', 'setStep']);


// Можно работать независимо с разными экземплярами последовательности
sequence = Sequence(0, 5, 1);
let sequence2 = Sequence(10, 15, 1);
iterator = sequence[Symbol.iterator]();
let iterator2 = sequence2[Symbol.iterator]();

iterator2.next();
iterator2.next();
iterator2.next();
sequence2.setStep(0.5);

iterator.next();
iterator.next();
sequence.setStep(2);

assert.deepEqual([1, 3, 5], [...sequence]);
assert.deepEqual([12, 12.5, 13, 13.5, 14, 14.5, 15], [...sequence2]);

