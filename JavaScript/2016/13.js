const n = +require('../getInput')(13, 2016).trim();
const aStar = require('../aStar');
const paintCoordsInContainer = require('../ui/paintCoordsInContainer');

const goal = [31, 39];
const start = [1, 1];
const favNumber = n;

function getNeighbours([x, y]) {
  const positions = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
  return positions.filter(([x, y]) => {
    if (x < 0 || y < 0) return false;
    const n = (x * x + 3 * x + 2 * x * y + y + y * y) + favNumber;
    const bitCount = n.toString(2).split('').reduce((sum, i) => sum + (i === '1' ? 1 : 0), 0);
    return bitCount % 2 === 0;
  });
}

const result = aStar({
  estimateDist: ([x, y]) => Math.abs(goal[0] - x) + Math.abs(goal[1] - y),
  getNeighbourDist: () => 1,
  getNeighbours,
  hashData: pos => pos.join('-'),
  isEnd: ([x, y]) => x === goal[0] && y === goal[1],
  startNode: start,
});
console.log(result);

const result2 = aStar({
  getNeighbourDist: () => 1,
  getNeighbours,
  hashData: pos => pos.join('-'),
  isEnd() { return false; },
  maxCosts: 50,
  startNode: start,
});
console.log(result2);

module.exports = {
  run(container) {
    const coords = Array.from(result.getExpandedNodes()).map(n => n.data);
    paintCoordsInContainer(coords, container, 200);
  },

  stop() {
  },

};
