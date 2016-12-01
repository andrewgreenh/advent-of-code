var input = require('../getInput')(14).trim().split('\n');
var _ = require('lodash');

const deers = input.reduce((result, line) => {
  var [, name, speed, time, rest] = line.match(/([A-Z]\w+).* (\d+) .* (\d+) .* (\d+) /);
  var [speed, time, rest] = [speed, time, rest].map(_.ary(parseInt, 1));
  return _.set(result, name, {name, speed, time, rest, distance: 0, points: 0});
}, {});
const calc = (deer, n) => _.set(deer, 'distance',
  Math.floor(n / (deer.time + deer.rest)) * deer.speed * deer.time +
  deer.speed * Math.min(n % (deer.time + deer.rest), deer.time));

_.range(1, 2504).forEach((i,e) => {
  _.reduce(deers, (agg, deer) => {
    deer = calc(deer, i);
    if(deer.distance == agg[0].distance) return agg.concat([deer]);
    return (deer.distance > agg[0].distance) ? [deer] : agg;
  }, [{distance:0}]).forEach((i,e) => deers[i.name].points++);
});

console.log(_(deers).pluck('distance').max());
console.log(_(deers).pluck('points').max());
