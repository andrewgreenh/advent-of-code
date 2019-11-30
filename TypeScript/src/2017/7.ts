import getInput from '../lib/getInput';
import { lines } from '../lib/ts-it/lines';
import * as _ from 'lodash';

let tree = buildTree();
console.log(tree.name);
totalWeights(tree);
console.log(findImbalanced(tree));

function buildTree() {
  let result = 0;
  let programms = {};
  let childNames: string[] = [];
  for (let line of lines(getInput(7, 2017))) {
    let [programm, children = ''] = line.split(' -> ');
    let [match, name, weightString] = <string[]>programm.match(
      /(\w+).*\((\d+)/,
    );
    childNames.push(...children.split(', '));
    let weight = +weightString;
    programms[name] = {
      name,
      weight,
      getChildren: () =>
        children ? children.split(', ').map(x => programms[x.trim()]) : [],
    };
  }
  function loadChildren(node) {
    node.children = node.getChildren();
    _.forEach(node.children, loadChildren);
  }
  const root = programms[_.difference(_.keys(programms), childNames)[0]];
  loadChildren(root);
  return root;
}

function totalWeights(node) {
  if (_.isEmpty(node.children)) {
    node.totalWeight = node.weight;
    return node;
  }
  node.totalWeight =
    node.weight +
    _(node.children)
      .map(c => totalWeights(c).totalWeight)
      .sum();
  return node;
}

function findImbalanced(node) {
  let children = node.children;
  let groups = _.groupBy(children, 'totalWeight');
  if (_.size(groups) === 1) return null;
  let imballanced = _.first(_.find(groups, group => _.size(group) === 1));
  let faulty = findImbalanced(imballanced);
  if (faulty === null) {
    let correctWeights = _.first(_.find(groups, group => _.size(group) > 1))
      .totalWeight;
    let correctWeight =
      correctWeights - imballanced.totalWeight + imballanced.weight;
    return [imballanced, correctWeight];
  }
  return faulty;
}
