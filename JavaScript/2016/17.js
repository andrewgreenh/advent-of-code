const { createHash } = require('crypto');
const _ = require('lodash');
const myAStar = require('../aStar');

const input = 'udskfozm';
const hash = s => createHash('md5').update(s).digest('hex');
const startingState = { passcode: input, position: [0, 0] };
const isEnd = ({ position: [x, y] }) => x === 3 && y === 3;
const hashState = ({ passcode }) => passcode;
const estimateCost = ({ position: [x, y] }) => Math.abs(x - 3) + Math.abs(y - 3);
const factors = { U: [0, -1], D: [0, 1], L: [-1, 0], R: [1, 0] };
const getNewPosition = ([x, y]) => direction => {
  const [xFactor, yFactor] = factors[direction];
  return [x + 1 * xFactor, y + 1 * yFactor];
};
const isDirectionPossible = position => direction => {
  const [newX, newY] = getNewPosition(position)(direction);
  return newX >= 0 && newX <= 3 && newY >= 0 && newY <= 3;
};
const isOpen = ([char, direction]) => 'bcdef'.includes(char);
const getNeighbours = ({ position, passcode }) => {
  const hashedPasscode = hash(passcode);
  const directions = ['U', 'D', 'L', 'R'];
  return hashedPasscode.substr(0, 4).split('')
    .map((item, index) => ([item, directions[index]]))
    .filter(isOpen)
    .map(([char, direction]) => direction)
    .filter(isDirectionPossible(position))
    .map(validDirection => ({
      position: getNewPosition(position)(validDirection),
      passcode: passcode + validDirection,
    }));
};

const aStarConfig = {
  estimateCost,
  getNeighbourCost: () => 1,
  getNeighbours,
  hashData: hashState,
  isEnd,
  startNode: startingState,
};

const result = myAStar(aStarConfig);
const result2 = myAStar(_.assign(aStarConfig, {
  heapComperator: (a, b) => b.h - a.h || b.g - a.g,
}));

console.log(result);
console.log(result2);
