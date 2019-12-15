import getInput from '../lib/getInput';
import { InfiniteGrid } from '../lib/InfiniteGrid';
import { IntCodeComputer } from '../lib/intCode';
import { LazyGraph } from '../lib/lazy-graph/LazyGraph';
import { numbers } from '../lib/ts-it/numbers';
import { keys } from '../lib/utils';
import _ = require('lodash');

const input = getInput(15, 2019);
let ins = numbers(input);

let dirs = { north: 1, south: 2, west: 3, east: 4 };
let offsets = { north: [0, -1], south: [0, 1], west: [-1, 0], east: [1, 0] };
let c = new IntCodeComputer([...ins], n => {});

let world = new InfiniteGrid<string, string>(() => ' ');

let graph = new LazyGraph<{
  x: number;
  y: number;
  done: boolean;
  computerState: IntCodeComputer['state'];
}>({
  hashData: data => [data.x, data.y].join('%'),
  getNeighbours: data => {
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
        if (c.state.outputs[0] === 0) {
          world.set([newX, newY], '#');
        }
        if (c.state.outputs[0] === 1) {
          next.push({
            x: data.x + offsets[key][0],
            y: data.y + offsets[key][1],
            computerState: c.state,
            done: false,
          });
        }
        if (c.state.outputs[0] === 2) {
          next.push({
            x: data.x + offsets[key][0],
            y: data.y + offsets[key][1],
            computerState: c.state,
            done: true,
          });
        }
      }
    }
    return next;
  },
});

const result = graph.findPath({
  isEnd: data => data.done,
  startNode: {
    computerState: c.state,
    done: false,
    x: 0,
    y: 0,
  },
});

if (result.isSuccess()) {
  console.log(result.cost);
}
