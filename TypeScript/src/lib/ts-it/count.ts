import isNil from '../isNil';

function* count(startOrEnd: number, end: number, step: number = 1): IterableIterator<number> {
  let from = isNil(end) ? 0 : startOrEnd;
  const to = isNil(end) ? (step < 0 ? -Infinity : Infinity) : end;
  const isPassed = x => (step < 0 ? x < to : x > to);
}
