import getInput from '../lib/getInput';

const prepareInput = (rawInput: string) => rawInput.split('').map(Number);

const basePattern = [0, 1, 0, -1];

const getMultiplier = (n: number, index: number) => {
  return basePattern[Math.floor(((index + 1) % (4 * n)) / n)];
};

const goA = (rawInput: string) => {
  let digits = prepareInput(rawInput);

  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < digits.length; j++) {
      let digit = 0;

      for (let k = 0; k < digits.length; k++) {
        digit += digits[k] * getMultiplier(j + 1, k);
      }

      digits[j] = Math.abs(digit) % 10;
    }
  }

  return digits.slice(0, 8).join('');
};

const goB = (rawInput: string) => {
  let base = prepareInput(rawInput);
  const baseOffset = Number(base.slice(0, 7).join(''));
  const times = Math.ceil((base.length * 10000 - baseOffset) / base.length);

  const digits = base
    .join('')
    .repeat(times)
    .split('')
    .map(Number)
    .flat()
    .slice(baseOffset % base.length);

  for (let i = 0; i < 100; i++) {
    for (let j = digits.length - 2; j >= 0; j--) {
      const digit = digits[j] + digits[j + 1];
      digits[j] = Math.abs(digit) % 10;
    }
  }

  return digits.slice(0, 8).join('');
};

/* Results */

const input = getInput(16, 2019);

const resultA = goA(input);
const resultB = goB(input);

console.log(resultA);
console.log(resultB);
