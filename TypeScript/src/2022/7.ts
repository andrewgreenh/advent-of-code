import * as R from 'remeda';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(7, 2022);
const lines = stringToLines(input);

type Dir = {
  name: string;
  fileSize: 0;
  dirs: Dir[];
  parent: Dir | null;
  size: number;
};

const root: Dir = {
  name: '/',
  fileSize: 0,
  dirs: [],
  parent: null,
  size: 0,
};

let currentDir = root;
for (const line of lines) {
  const [a, b, c] = line.split(' ');

  if (c === '..') currentDir = currentDir.parent!;
  else if (c === '/') currentDir = root;
  else if (a === '$' && b === 'cd') {
    currentDir = {
      name: c,
      size: 0,
      parent: currentDir,
      dirs: [],
      fileSize: 0,
    };
    currentDir.parent!.dirs.push(currentDir);
  }

  if (a.match(/\d+/)) currentDir.fileSize += +a;
}

function addSizes(dir: Dir) {
  for (const d of dir.dirs) addSizes(d);
  dir.size = dir.fileSize + R.sumBy(dir.dirs, (d) => d.size);
}
addSizes(root);

function allDirs(dir: Dir): Dir[] {
  return [dir, ...R.flatMap(dir.dirs, (d) => allDirs(d))];
}

console.log(R.sumBy(allDirs(root), (d) => (d.size <= 100000 ? d.size : 0)));

const toBeDeleted = 30000000 - (70000000 - root.size);

console.log(
  R.pipe(
    allDirs(root),
    R.filter((d) => d.size > toBeDeleted),
    R.minBy((d) => d.size),
  )?.size,
);
