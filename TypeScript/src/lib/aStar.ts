import Heap from './Heap';
import * as _ from 'lodash';

export interface AStarConfig<DataType> {
  // Used to estimate remaining cost of a node. MUST NOT overestimate the cost.
  estimateCost: (data: DataType) => number;

  /*
     * Tweaks the order in which nodes get explored.
     *   0 -> Djikstra-search;
     *   1 -> Very fast but not fastes path
     */
  estimationWeight: number;

  // Calculates cost between 2 neighbour nodes.
  getNeighbourCost: (data1: DataType, data2: DataType) => number;

  // Returns neighbours of a given node.
  getNeighbours: (data: DataType) => DataType[];

  // Returns a string representation of the node.
  hashData: (data: DataType) => string;

  // Order in which the nodes get expanded. Return negative number if a should come before b.
  heapComperator: (node1: AStarNode<DataType>, node2: AStarNode<DataType>) => number;

  // Determines if node is the goal.
  isEnd: (data: DataType) => boolean;

  // When maxCosts is given, the algorithm stops when maxCosts is reached
  maxCosts: number;

  // First node in the open list
  startNode: DataType;
}

interface AStarNode<DataType> {
  data: DataType;

  // Current costs to reach this node
  g: number;

  // Estimated remaining costs for this node.
  h: number;

  // Weighted addition of g and h. This is the cost value that is used to determine next nodes.
  f: number;

  // Identifier for this data node. Used to prevent duplicates.
  hash: string;

  previousNode?: AStarNode<DataType>;
}

function aStar<DataType>(config: AStarConfig<DataType>) {
  const {
    estimateCost = () => 0,
    estimationWeight = 0.5,
    getNeighbourCost = () => 1,
    getNeighbours,
    hashData,
    heapComperator = (a: AStarNode<DataType>, b: AStarNode<DataType>) => a.f - b.f,
    isEnd,
    maxCosts = Infinity,
    startNode: startData,
  } = config;

  const shouldNodeComeBeforeNode = (a: AStarNode<DataType>, b: AStarNode<DataType>) =>
    heapComperator(a, b) < 0;

  const startNode = {
    data: startData,
    g: 0,
    h: estimateCost(startData),
    f: estimationWeight * estimateCost(startData),
    hash: hashData(startData),
  };
  const openNodesByHash = new Map<string, AStarNode<DataType>>();
  const openNodes = new Heap(shouldNodeComeBeforeNode);
  const closedNodesByHash = new Map<string, AStarNode<DataType>>();

  openNodesByHash.set(startNode.hash, startNode);
  openNodes.add(startNode);

  let counter = 0;
  while (openNodes.size !== 0) {
    const node = openNodes.pop() as AStarNode<DataType>;
    openNodesByHash.delete(node.hash);

    closedNodesByHash.set(node.hash, node);
    if (isEnd(node.data)) return finish(node, counter, closedNodesByHash);
    if (node.g > maxCosts) return finish(node, counter, closedNodesByHash);
    counter++;

    const neighbourData = getNeighbours(node.data);
    for (let i = 0; i < neighbourData.length; i++) {
      const currentData = neighbourData[i];
      const hash = hashData(currentData);
      if (closedNodesByHash.has(hash)) continue;
      const g = node.g + getNeighbourCost(node.data, currentData);

      const existingNode = openNodesByHash.get(hash);
      const isInOpenList = existingNode !== undefined;
      if (existingNode !== undefined && g >= existingNode.g) continue;
      if (existingNode !== undefined) {
        existingNode.g = g;
        existingNode.previousNode = node;
        existingNode.f = (1 - estimationWeight) * g + estimationWeight * existingNode.h;
      } else {
        const h = estimateCost(currentData);
        const neighbourNode = {
          data: currentData,
          f: (1 - estimationWeight) * g + estimationWeight * h,
          h,
          g,
          hash,
          previousNode: node,
        };
        openNodesByHash.set(hash, neighbourNode);
        openNodes.add(neighbourNode);
      }
    }
  }
  return fail(closedNodesByHash, counter);
}

function fail(closedNodesByHash, counter) {
  return {
    status: 'Fail :(',
    expandedNodeCounter: counter,
    getExpandedNodes: () => closedNodesByHash.values(),
  };
}

function finish(node, counter, closedNodesByHash) {
  const path = recursiveNodeToArray(node);
  return {
    status: 'success',
    cost: node.g,
    expandedNodeCounter: counter,
    getExpandedNodes: () => closedNodesByHash.values(),
    target: path[path.length - 1],
    getPath: () => path,
  };
}

function recursiveNodeToArray(node) {
  const result = [];
  let current = node;
  while (current) {
    result.unshift(_.omit(current, 'previousNode'));
    current = current.previousNode;
  }
  return result;
}
