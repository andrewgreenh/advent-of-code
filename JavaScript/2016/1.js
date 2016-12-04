const _ = require('lodash');
const input = require('../getInput')(1, 2016);
const paintCoordsInContainer = require('../ui/paintCoordsInContainer');

const commands = input.split(', ').map(comm => ([comm[0], comm.slice(1)]));
const turn = (d, t) => ((d + 4 + (t === 'R' ? 1 : -1)) % 4);
const factors = [[0, 1], [1, 0], [0, -1], [-1, 0]];

const toString = coord => coord.join(',');
const result = commands.reduce(([[x, y], dir, prevCoords, firstDouble], [t, steps]) => {
  const visited = _.times(steps, step => {
    const factor = factors[turn(dir, t)];
    const newCoord = [x + factor[0] * (step + 1), y + factor[1] * (step + 1)];
    if (_.includes(prevCoords, toString(newCoord)) && !firstDouble) firstDouble = newCoord;
    return newCoord;
  });
  return [_.last(visited), turn(dir, t), [...prevCoords, ...visited.map(toString)], firstDouble];
}, [[0, 0], 0, [], null]);

console.log(_.sum(result[0].map(Math.abs)), _.sum(result[3].map(Math.abs)));


// For electron
module.exports = {
  run(container) {
    const coords = result[2].map(str => (([x, y]) => ([+x, +y]))(str.split(',')));
    paintCoordsInContainer(coords, container);
  },

  stop() {
  },

};
