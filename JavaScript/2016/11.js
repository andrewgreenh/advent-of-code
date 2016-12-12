const _ = require('lodash');
const aStar = require('a-star');
const myAStar = require('../aStar');

const testFloors = [
  'HM LM'.split(' '),
  ['HG'],
  ['LG'],
  [],
];

const firstFloors = [
  ['SG', 'SM', 'PG', 'PM'],
  ['TG', 'RG', 'RM', 'CG', 'CM'],
  ['TM'],
  [],
];
const secondFloors = [
  ['SG', 'SM', 'PG', 'PM', 'EG', 'EM', 'DG', 'DM'],
  ['TG', 'RG', 'RM', 'CG', 'CM'],
  ['TM'],
  [],
];

const floorCount = 4;
const startingState = {
  floors: firstFloors,
  elevator: 0,
};

function isEnd(state) {
  return _.every(_.initial(state.floors), _.isEmpty);
}

function getNeighbours({ elevator, floors }) {
  const currentFloor = floors[elevator];
  const singles = _.clone(currentFloor).map(i => ([i]));
  const doubles = [];
  for (let i = 0; i < singles.length; i++) {
    for (let j = i + 1; j < singles.length; j++) {
      doubles.push([...singles[i], ...singles[j]]);
    }
  }
  const newStates = _.flatMap([...doubles, ...singles], itemsToMove => {
    const states = [];
    if (elevator < floorCount - 1) {
      const newFloors = _.clone(floors);
      newFloors[elevator] = _.without(floors[elevator], ...itemsToMove);
      newFloors[elevator + 1] = [...floors[elevator + 1], ...itemsToMove];
      states.push({ elevator: elevator + 1, floors: newFloors });
    }
    if (elevator > 0 && !_.every(_.slice(floors, 0, elevator), _.isEmpty)) {
      const newFloors = _.clone(floors);
      newFloors[elevator] = _.without(floors[elevator], ...itemsToMove);
      newFloors[elevator - 1] = [...floors[elevator - 1], ...itemsToMove];
      states.push({ elevator: elevator - 1, floors: newFloors });
    }
    return states;
  });
  const workingStates = _.filter(newStates, ({ floors }) => _.every(floors, isFloorOkay));
  return workingStates;
}

function isFloorOkay(floor) {
  const [chips, generators] = _.partition(floor, element => element[1] === 'M');
  const someWillBeFried = _.some(chips, chip => {
    const badGeneratorPresent = _.some(generators, gen => gen[0] !== chip[0]);
    if (!badGeneratorPresent) return false;
    const goodGeneratorPresent = _.includes(generators, `${chip[0]}G`);
    if (!goodGeneratorPresent) return true;
    return false;
  });
  return !someWillBeFried;
}

function getDistanceBetweenNeighbours() {
  return 1;
}

function getDistanceGuess(state) {
  return _.reduce(
    state.floors,
    (sum, floor, index) => sum + floor.length * (floorCount - index - 1),
    0
  );
}

function hashFloors(floors) {
  const pairs = {};
  floors.forEach((floor, index) => {
    floor.forEach(element => {
      if (!pairs[element[0]]) pairs[element[0]] = [];
      pairs[element[0]].push(index);
    });
  });
  const flatPairs = _.orderBy(_.values(pairs), ['0', '1']);
  return flatPairs.map(i => i.join('')).join('-');
}

function hashState({ elevator, floors }) {
  const hashedFloors = hashFloors(floors);
  return `${elevator}-${hashedFloors}`;
}

console.time('lib');
const result = aStar({
  start: startingState,
  isEnd,
  neighbor: getNeighbours,
  distance: getDistanceBetweenNeighbours,
  heuristic: getDistanceGuess,
  hash: hashState,
});
console.timeEnd('lib');

// console.time('mystar');
// const result = myAStar({
//   estimateDist: getDistanceGuess,
//   getNeighbourDist: getDistanceBetweenNeighbours,
//   getNeighbours,
//   hashData: hashState,
//   isEnd,
//   startNode: startingState,
// });
// console.timeEnd('mystar');

console.log(result);
