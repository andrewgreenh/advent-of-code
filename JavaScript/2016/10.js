const _ = require('lodash');
const lines = require('../getInput')(10, 2016).trim().split('\n');

const bots = [];
const outputs = [];
const valueSets = [];
lines.forEach(line => {
  const parts = line.split(' ');
  if (parts[0] === 'value') {
    let [, value, , , , botNum] = parts;
    [value, botNum] = [value, botNum].map(i => parseInt(i, 10));
    valueSets.push([value, botNum]);
    return;
  }
  // eslint-disable-next-line
  let [, botNum,,,, lowBotOrOutput, lowNum,,,, highBotOrOutput, highNum] = line.split(' ');
  [botNum, lowNum, highNum] = [botNum, lowNum, highNum].map(i => parseInt(i, 10));
  if (!bots[botNum]) {
    bots[botNum] = {};
  }
  bots[botNum] = {
    index: botNum,
    lowTarget: lowBotOrOutput,
    highTarget: highBotOrOutput,
    values: [],
    lowNum,
    highNum,
  };
});

valueSets.forEach(([value, botNum]) => {
  placeValue(botNum, value);
});

function placeValue(botNum, value) {
  const bot = bots[botNum];
  bot.values.push(value);
  if (bot.values.length < 2) return;
  const [lower, upper] = _.sortBy(bot.values);
  if (lower === 17 && upper === 61) console.log(bot);
  if (bot.lowTarget === 'output') {
    outputs[bot.lowNum] = lower;
  } else {
    placeValue(bot.lowNum, lower);
  }
  if (bot.highTarget === 'output') {
    outputs[bot.highNum] = upper;
  } else {
    placeValue(bot.highNum, upper);
  }
}

console.log(outputs[0] * outputs[1] * outputs[2]);
