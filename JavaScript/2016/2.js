const _ = require('lodash');
const input = require('../getInput')(2, 2016);

const first = [['1', '2', '3'],
               ['4', '5', '6'],
               ['7', '8', '9']];
const second = [['', '', '1', '', ''],
                ['', '2', '3', '4', ''],
                ['5', '6', '7', '8', '9'],
                ['', 'A', 'B', 'C', ''],
                ['', '', 'D', '', '']];
const directions = { U: [0, -1], R: [1, 0], D: [0, 1], L: [-1, 0] };
const result = (pad, start) => _.compact(input.split('\n')).reduce(([code, [x, y]], line) => {
  const [newX, newY] = line.split('').reduce(([x, y], command) => {
    const newX = x + directions[command][0];
    const newY = y + directions[command][1];
    return _.get(pad, `${newY}.${newX}`) ? [newX, newY] : [x, y];
  }, [x, y]);
  return [code + pad[newY][newX], [newX, newY]];
}, ['', start]);

console.log(result(first, [1, 1])[0], result(second, [0, 2])[0]);
