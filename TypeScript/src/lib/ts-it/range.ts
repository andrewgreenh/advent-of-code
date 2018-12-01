import isNil from '../isNil';

export function* range(
  start: number,
  end?: Nillable<number>,
  step: number = 1,
): IterableIterator<number> {
  let from = start;
  const to = isNil(end) ? (step < 0 ? -Infinity : Infinity) : end;
  const isPassed = x => (step < 0 ? x <= to : x >= to);
  while (!isPassed(from)) {
    yield from;
    from += step;
  }
}
