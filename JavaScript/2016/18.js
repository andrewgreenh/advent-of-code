const firstRow = require('../getInput')(18, 2016).trim().split('').map(char => char === '.');

const t = row => row.map((b, i, arr) => (i <= 0 || arr[i-1]) === (i >= arr.length-1 || arr[i+1]));

const getResult = row => (rowCount, counter = row.reduce((s, b) => (b ? s + 1 : s), 0)) => {
  const count = row => { counter += row.reduce((s, b) => (b ? s + 1 : s), 0); return row; };
  while (rowCount-- - 1) row = count(t(row));
  console.log(counter);
};

[40, 400000].map(n => getResult(firstRow)(n));
