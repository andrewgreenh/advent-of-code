const _ = require('lodash');
var input = require('../getInput')(18).trim().split('\n').map(l => l.split(''));

const conway1 = getStep(100, input, prepareCell);
const conway2 = getStep(100, activateCorners(input), prepareCellWithStucks);
console.log(_(conway1).flatten().countBy().value()['#']);
console.log(_(conway2).flatten().countBy().value()['#']);

function getStep(n, input, prepareFn) {
  var next = input;
  for(var i = 0; i < n; i++) {
    next = _([...TwoDArrayIterator(next)])
      .map(prepareFn).map(updateCell)
      .pluck('value').chunk(input[0].length)
      .value();
    paint2DArray(next);
  }
  return next;
}

function paint2DArray(grid) {
  var output = grid.map(line => line.join(''));
  output.push(_.repeat('%', 150));
  output = output.join('\n');
  console.log(output);
}

function activateCorners(input) {
  input[0][0] = '#';
  input[0][input[0].length -1] = '#';
  input[input.length -1][0] = '#';
  input[input.length -1][input[0].length -1] = '#';
  return input;
}

function prepareCell(cell) {
  var livingNeighbours = _.reduce([...CellNeighbourIterator(cell)], (sum, cellValue) =>
      (cellValue === '#') ? sum+1 : sum, 0);
  if(cell.value === '#') {
    if(livingNeighbours === 2 || livingNeighbours === 3) cell.next = '#';
    else cell.next = '.';
  } else {
    if(livingNeighbours === 3) cell.next = '#';
    else cell.next = '.';
  }
  return cell;
}

function prepareCellWithStucks(cell) {
  if(cell.x == 0 && cell.y == 0 ||
     cell.x == input[0].length -1 && cell.y == 0 ||
     cell.x == 0 && cell.y == input.length -1 ||
     cell.x == input[0].length-1 && cell.y == input.length-1) {
    cell.next = '#';
    return cell;
  } else return prepareCell(cell);
}

function updateCell(cell) {
  cell.value = cell.next;
  cell.next = undefined;
  return cell;
}

function* CellNeighbourIterator(cell) {
  yield cell.topLeft;
  yield cell.top;
  yield cell.topRight;
  yield cell.left;
  yield cell.right;
  yield cell.bottomLeft;
  yield cell.bottom;
  yield cell.bottomRight;
}

function* TwoDArrayIterator(input) {
  const maxY = input.length;
  const maxX = input[0].length;
  for(var y = 0; y < maxY; y++) {
    for(var x = 0; x < maxX; x++) {
      yield {
        value: input[y][x],
        x,
        y,
        topLeft: _.get(input, `${y-1}.${x-1}`, '.'),
        top: _.get(input, `${y-1}.${x}`, '.'),
        topRight: _.get(input, `${y-1}.${x+1}`, '.'),
        left: _.get(input, `${y}.${x-1}`, '.'),
        right: _.get(input, `${y}.${x+1}`, '.'),
        bottomLeft: _.get(input, `${y+1}.${x-1}`, '.'),
        bottom: _.get(input, `${y+1}.${x}`, '.'),
        bottomRight: _.get(input, `${y+1}.${x+1}`, '.'),
      }
    }
  }
}
