import getInput from '../lib/getInput';

let n = getInput(14, 2018);

let [r, [a, b], i] = [[3, 7], [0, 1], -1];
while (i < 0) {
  for (let c of (r[a] + r[b]).toString()) r.push(+c);
  [a, b] = [(a + r[a] + 1) % r.length, (b + r[b] + 1) % r.length];
  if (r.length === +n + 10) console.log(r.slice(+n, +n + 10).join(''));
  let tail = r.slice(-10).join('');
  i = tail.indexOf(n) < 0 ? -1 : tail.indexOf(n) + r.length - 10;
}
console.log(i);
