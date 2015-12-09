const _ = require('lodash');
const permutate = require('../permutate');
var input = require('../getInput')(9).trim().split('\n');

const grid = input.reduce((grid, row) => {
  var [from,,to,,dist] = row.split(' ');
  dist = parseInt(dist);
  return _(grid).set( `${from}.${to}`, dist).set(`${to}.${from}`, dist).value();
}, {});

const dists = permutate(_.keys(grid)).map(perm => perm
    .reduce((agg, e, i, arr) => agg + grid[arr[i]][arr[i-1]] || 0, 0));
console.log(_.min(dists), _.max(dists));
