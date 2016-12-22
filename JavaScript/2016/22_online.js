/* eslint-disable */


const getInput = () => document.getElementById('input').value;
document.getElementById('start').addEventListener('click', () => {
  setUp(getInput().trim().split('\n').filter(line => _.startsWith(line, '/dev')));
});

let listener = null;
function setUp(lines) {
  if (listener) window.removeEventListener('keydown', listener);
  const parse = line => {
    const parts = line.split(/ +/);
    const position = parts[0].match(/\d+/g);
    const x = position[0];
    const y = position[1];
    return {
      x: +x,
      y: +y,
      used: +parts[2].replace('T', ''),
      free: +parts[3].replace('T', ''),
      size: +parts[1].replace('T', ''),
    };
  };
  const correctNodes = lines.map(parse);
  const maxX = _.maxBy(correctNodes, 'x').x;
  const maxY = _.maxBy(correctNodes, 'y').y;
  const minSize = _(correctNodes).map('size').min();

  const simpleNodes = correctNodes.map(node => ({
    x: node.x,
    y: node.y,
    empty: node.used === 0,
    large: node.used > minSize,
    hasGoal: node.x === maxX && node.y ===0,
  }));

  const grid = toSimple(_.zip(..._.chunk(simpleNodes, maxY + 1)));

  function toSimple(grid) {
    return _.map(grid, row => _.map(row, item => {
      if (item.hasGoal) return 'G';
      if (item.large) return '#';
      if (item.empty) return '_';
      return '.';
    }));
  }

  function paintGrid(grid, steps, up = true) {
    document.getElementById('result').innerHTML = _.map(grid, row => row.join(' ')).join('\n');
    document.getElementById('steps').innerHTML = `Steps: ${steps}`;
  }

  function part1(nodes) {
    const wouldFit = (nodeA, nodeB) =>
      (nodeA.free >= nodeB.used && nodeB.used !== 0);
    let counter = 0;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue;
        if (wouldFit(nodes[i], nodes[j])) counter++;
      }
    }
    console.log(counter);
  }

  part1(correctNodes);

  const startNode = _.find(simpleNodes, 'empty');
  let state = _.cloneDeep(grid);
  let position = [startNode.x, startNode.y];
  let stepCounter = 0;

  paintGrid(grid, stepCounter, false);
  const handleKey = name => {
    const [x, y] = position;
    if (name === 'up') {
      if (y === 0) return;
      if (state[y-1][x] === '#') return;
      state[y][x] = state[y-1][x];
      state[y-1][x] = '_';
      position = [x, y-1];
    } else if (name === 'right') {
      if (x === maxX) return;
      if (state[y][x + 1] === '#') return;
      state[y][x] = state[y][x+1];
      state[y][x+1] = '_';
      position = [x+1, y];
    } else if (name === 'down') {
      if (y === maxY) return;
      if (state[y+1][x] === '#') return;
      state[y][x] = state[y+1][x];
      state[y+1][x] = '_';
      position = [x, y+1];
    } else if (name === 'left') {
      if (x === 0) return;
      if (state[y][x-1] === '#') return;
      state[y][x] = state[y][x-1];
      state[y][x-1] = '_';
      position = [x-1, y];
    } else if (name === 'escape') {
      state = _.cloneDeep(grid);
      stepCounter = -1;
      position = [startNode.x, startNode.y];
    } else {
      return;
    }
    stepCounter++;
    paintGrid(state, stepCounter);
    if (state[0][0] === 'G') {
      document.getElementById('won').innerHTML = `You won after ${stepCounter} steps.`
    }
  };
  listener = ({ which }) => {
    if (which === 37) handleKey('left');
    if (which === 38) handleKey('up');
    if (which === 39) handleKey('right');
    if (which === 40) handleKey('down');
  };
  window.addEventListener('keydown', listener);
}
