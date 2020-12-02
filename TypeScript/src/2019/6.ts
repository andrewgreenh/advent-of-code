import getInput from '../lib/getInput';
import { LazyGraph } from '../lib/lazy-graph/LazyGraph';
import { iterable } from '../lib/ts-it/iterable';
import { stringToLines } from '../lib/ts-it/lines';
import { p } from '../lib/ts-it/pipe';
import { isTruthy, values } from '../lib/utils';

const input = getInput(6, 2019);
const lines = iterable(() => p(input)(stringToLines));

type Node = {
  name: string;
  parent: Node | null;
  children: Node[];
  path: Node[];
};
const nodes: ObjectOf<Node> = {};

for (const line of lines) {
  const [inner, outer] = line.split(')');
  if (!nodes[inner])
    nodes[inner] = { name: inner, children: [], parent: null, path: [] };
  if (!nodes[outer])
    nodes[outer] = { name: outer, children: [], parent: null, path: [] };
  nodes[outer].parent = nodes[inner];
  nodes[inner].children.push(nodes[outer]);
}

const root = nodes['COM'];
addPath(root);

let sum = 0;
for (let node of values(nodes)) {
  sum += node.path.length;
}
console.log(sum);

let start = nodes['YOU'].parent!;
let end = nodes['SAN'].parent!;

let graph = new LazyGraph<Node>({
  getNeighbourCost: () => 1,
  hashData: (n) => n.name,
  getNeighbours: (n) => [n.parent, ...n.children].filter(isTruthy),
});

let path = graph.findPath({
  isEnd: (n) => n === end,
  startNode: start,
});
if (path.isSuccess()) {
  console.log(path.cost);
}

function addPath(node: Node, previousPath: any[] = []) {
  node.path = previousPath;
  node.children.forEach((child) => {
    addPath(child, [...previousPath, node]);
  });
}
