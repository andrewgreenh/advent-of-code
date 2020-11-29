import _ from 'lodash';
import { assert } from '../lib/assert';
import getInput from '../lib/getInput';
import { IntCodeComputer } from '../lib/intCode';
import { LazyGraph } from '../lib/lazy-graph/LazyGraph';
import { lastOrFail } from '../lib/ts-it/last';
import { map } from '../lib/ts-it/map';
import { max } from '../lib/ts-it/max';
import { numbers } from '../lib/ts-it/numbers';
import { p } from '../lib/ts-it/pipe';
import { keys } from '../lib/utils';

const input = getInput(15, 2019);
let ins = numbers(input);

let dirs = { north: 1, south: 2, west: 3, east: 4 };
let offsets = { north: [0, -1], south: [0, 1], west: [-1, 0], east: [1, 0] };
let c = new IntCodeComputer([...ins], (n) => {});

let graph = new LazyGraph<{
  x: number;
  y: number;
  done: boolean;
  computerState: IntCodeComputer['state'];
}>({
  hashData: (data) => [data.x, data.y].join('%'),
  getNeighbours: (data) => {
    let next: {
      x: number;
      y: number;
      computerState: IntCodeComputer['state'];
      done: boolean;
    }[] = [];
    for (let key of keys(dirs)) {
      const newX = data.x + offsets[key][0];
      const newY = data.y + offsets[key][1];
      c.state = _.cloneDeep(data.computerState);
      c.addInput(dirs[key]);
      try {
        c.run();
      } catch {
        if (lastOrFail(c.state.outputs) === 1) {
          next.push({
            x: newX,
            y: newY,
            computerState: _.cloneDeep(c.state),
            done: false,
          });
        }
        if (lastOrFail(c.state.outputs) === 2) {
          next.push({
            x: newX,
            y: newY,
            computerState: _.cloneDeep(c.state),
            done: true,
          });
        }
      }
    }
    return next;
  },
});

const result = graph.findPath({
  isEnd: (data) => data.done,
  startNode: { computerState: c.state, done: false, x: 0, y: 0 },
});

assert(result.isSuccess());
console.log(result.cost);

const result2 = graph.findPath({
  isEnd: () => false,
  startNode: result.target.data,
});

console.log(
  p(result2.getExpandedNodes())(
    map((n) => n.g),
    max,
  ),
);
