import getInput from '../lib/getInput';
import { abs } from '../lib/math/abs';
import { cross } from '../lib/ts-it/cross';
import { numbers } from '../lib/ts-it/numbers';
import { sum } from '../lib/ts-it/sum';
import { isTruthy } from '../lib/utils';

const input = getInput(19, 2021);
const scanners = input
  .split(/--- scanner \d+ ---/g)
  .map((x) => x.trim())
  .filter(isTruthy)
  .map((x) => x.split('\n').map(numbers) as Point3D[])
  .map(
    (beacons, i): Scanner => ({
      beacons,
      name: `Scanner ${i}`,
      pos: [0, 0, 0],
    }),
  );

type Point2D = [number, number];
type Point3D = [number, number, number];
type Scanner = {
  beacons: Point3D[];
  name: string;
  pos: Point3D;
};

const facings = [
  [
    [0, 1],
    [1, 1],
    [2, 1],
  ],
  [
    [1, 1],
    [0, -1],
    [2, 1],
  ],
  [
    [2, 1],
    [1, 1],
    [0, -1],
  ],
  [
    [0, -1],
    [1, -1],
    [2, 1],
  ],
  [
    [2, -1],
    [1, 1],
    [0, 1],
  ],
  [
    [1, -1],
    [2, -1],
    [0, 1],
  ],
] as [Point2D, Point2D, Point2D][];

const rotations = [
  [
    [1, 1],
    [2, 1],
  ],
  [
    [2, 1],
    [1, -1],
  ],
  [
    [1, -1],
    [2, -1],
  ],
  [
    [2, -1],
    [1, 1],
  ],
] as [Point2D, Point2D][];

const orientations = [...cross(facings, rotations)].map(
  ([facing, rotation]) => ({
    facing,
    rotation,
  }),
);

let [orientedScanner, ...disorientedScanners] = scanners;
let allOriented = [orientedScanner];
let toExplore = [orientedScanner];

const totalComparisonCount = (scanners.length * scanners.length + 1) / 2;
console.log(`Starting with ${totalComparisonCount} comparisons`);
let i = 0;

let next: Scanner | undefined;
while ((next = toExplore.pop())) {
  disorientedScanners = disorientedScanners.filter((other) => {
    console.log(`${i++}`);
    const project = findProjection(next!.beacons, other.beacons);
    if (!project) return true;

    const orientedScanner: Scanner = {
      ...other,
      beacons: other.beacons.map(project),
      pos: project(other.pos),
    };
    toExplore.push(orientedScanner);
  });
  allOriented.push(next);
}

const beacons = new Set<string>();
for (const scanner of allOriented) {
  for (const beacon of scanner.beacons) beacons.add(JSON.stringify(beacon));
}
console.log(beacons.size);

let maxDist = 0;
for (const { pos: a } of allOriented) {
  for (const { pos: b } of allOriented) {
    const dist = sum(a.map((a, i) => abs(a - b[i])));
    if (dist > maxDist) maxDist = dist;
  }
}
console.log(maxDist);

function findProjection(
  source: Point3D[],
  target: Point3D[],
): null | ((point: Point3D) => Point3D) {
  for (const orientation of orientations) {
    const oriented = target.map((p) => orient(orientation, p));
    for (const refA of source) {
      for (const refB of oriented) {
        const offset = refB.map((b, i) => refA[i] - b) as Point3D;

        let count = 0;
        const projectedTarget = oriented.map((p) => applyOffset(p, offset));
        for (const a of source) {
          for (const b of projectedTarget) {
            if (arePointsEqual(a, b)) count++;
            if (count >= 12) return buildProjectionFunc(orientation, offset);
          }
        }
      }
    }
  }
  return null;
}

function buildProjectionFunc(orientation: Orientation, offset: Point3D) {
  return function project(point: Point3D) {
    return applyOffset(orient(orientation, point), offset);
  };
}

function orient(
  orientation: Orientation,
  point: [number, number, number],
): Point3D {
  const afterFacing = orientation.facing.map(
    ([c, p]) => point[c] * p,
  ) as Point3D;
  const afterRotation = [
    afterFacing[0],
    afterFacing[orientation.rotation[0][0]] * orientation.rotation[0][1],
    afterFacing[orientation.rotation[1][0]] * orientation.rotation[1][1],
  ] as Point3D;
  return afterRotation;
}

function applyOffset(point: Point3D, offset: Point3D): Point3D {
  return point.map((p, i) => p + offset[i]) as Point3D;
}

function arePointsEqual(a: Point3D, b: Point3D) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

type Orientation = {
  facing: [Point2D, Point2D, Point2D];
  rotation: [Point2D, Point2D];
};
