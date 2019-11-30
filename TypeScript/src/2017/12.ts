import { alg, Graph } from 'graphlib';

import getInput from '../lib/getInput';
import { lines } from '../lib/ts-it/lines';

let graph = new Graph({ directed: false });
for (let line of lines(getInput(12, 2017))) {
  let [group, others] = line.split('<->').map(x => x.trim());
  for (let other of others.split(', ')) graph.setEdge(group, other);
}

let components = alg.components(graph);
console.log((<any[]>components.find(c => c.includes('0'))).length);
console.log(components.length);
