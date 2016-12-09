const _ = require('lodash');
const lines = require('../getInput')(8, 2016).trim().split('\n');

const write = process.stdout.write.bind(process.stdout);

function rect(grid, x, y) {
  _.range(y).forEach(i => {
    _.range(x).forEach(j => {
      grid[i][j] = '#';
    });
  });
  return grid;
}

function colRotate(grid, col, rotation) {
  const newCol = [];
  _.range(grid.length).forEach(i => {
    const newIndex = (i + rotation) % grid.length;
    newCol[newIndex] = grid[i][col];
  });
  _.range(grid.length).forEach(i => { grid[i][col] = newCol[i]; });
  return grid;
}

function rowRotate(grid, row, rotation) {
  const newRow = [];
  _.range(grid[0].length).forEach(i => {
    const newIndex = (i + rotation) % grid[0].length;
    newRow[newIndex] = grid[row][i];
  });
  _.range(grid[0].length).forEach(i => { grid[row][i] = newRow[i]; });
  return grid;
}

function countLights(grid) {
  return _.sumBy(_.flattenDeep(grid), i => (i === '#' ? 1 : 0));
}

function print(grid) {
  console.log(grid.map(row => row.join('')).join('\n'));
  write('\u001b[6A');
}

const grid = _.map(new Array(6), () => _.fill(new Array(50), ' '));
const gridHistory = [];
_.forEach(lines, line => {
  const [command, ...rest] = line.split(' ');
  if (command === 'rect') {
    const x = rest[0].split('x')[0];
    const y = rest[0].split('x')[1];
    rect(grid, x, y);
  } else {
    const [rowOrCol, n, , rotation] = rest;
    if (rowOrCol === 'row') {
      const y = parseInt(n.split('=')[1], 10);
      rowRotate(grid, y, parseInt(rotation, 10));
    }
    if (rowOrCol === 'column') {
      const x = parseInt(n.split('=')[1], 10);
      colRotate(grid, x, parseInt(rotation, 10));
    }
  }
  gridHistory.push(_.cloneDeep(grid));
});

// console.log(countLights(grid));
// print(grid);
animate();

function animate(i = 0) {
  print(gridHistory[i]);
  if (i < gridHistory.length - 1) setTimeout(() => animate(i + 1), 20);
  else {
    write('\u001b[6B');
    console.log(countLights(gridHistory[i]));
  }
}
