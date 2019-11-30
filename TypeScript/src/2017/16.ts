import getInput from '../lib/getInput';

let moveMap = {
  s: n => p => [...p.slice(-+n), ...p.slice(0, -+n)],
  p: (a, b) => p => p.map(x => (x === a ? b : x === b ? a : x)),
  x: (a, b) => p => p.map((x, i) => (i === +a ? p[+b] : i === +b ? p[+a] : x)),
};

let input = getInput(16, 2017).trim();
let moves = input
  .split(',')
  .map(move => moveMap[move[0]](...move.slice(1).split('/')));
let dance = p => moves.reduce((p, move) => move(p), p.split('')).join('');

const danceN = (n, p, history: string[] = []) => {
  for (let cycleLength = 0; cycleLength < n; cycleLength++, p = dance(p)) {
    if (history.includes(p)) return history[n % cycleLength];
    history.push(p);
  }
  return p;
};

console.log(dance('abcdefghijklmnop'));
console.log(danceN(1000000000, 'abcdefghijklmnop'));
