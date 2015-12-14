var input = require('../getInput')(14).trim().split('\n');
var _ = require('lodash');

var result = input.reduce((agg, line) => {
  var obj = calc(line, 2503);
  if(obj.distance > agg.distance) {
    return obj;
  }
  return agg;
}, {distance:0});

function calc(str, n) {
  var [name,,, speed,,, time,,,,,,, rest] = str.split(' ');
  var [speed, time, rest] = [speed, time, rest].map(_.ary(parseInt, 1));
  var distance = Math.floor(n / (time + rest)) * speed * time;
  var remaining = n % (time+rest);
  if(remaining <= time) distance += remaining * speed;
  else distance += time * speed;
  return {name, distance};
}

console.log(result);
