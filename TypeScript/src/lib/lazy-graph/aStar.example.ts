import { aStar } from './aStar';

let dist = [
  [0, Infinity, Infinity, 5],
  [Infinity, 0, 2, 9],
  [Infinity, 2, 0, 3],
  [5, 9, 3, 0],
];

let result = aStar<number>({
  estimateCost: () => 0,
  getNeighbourCost: (a, b) => dist[a][b],
  hashData: (x) => x.toString(),
  getNeighbours: (i) =>
    dist[i]
      .map((d, index) => (d === Infinity ? -1 : index))
      .filter((x) => x > -1),
  isEnd: (i) => i === 1,
  startNode: 0,
});

if (result.isSuccess()) {
  console.log(result.cost);
  let path = result.getPath();
  console.log(path);
} else {
  console.log('failed!');
}
