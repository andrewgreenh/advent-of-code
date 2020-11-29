import isNil from '../isNil';

export function range(start: number, end?: Nillable<number>, step: number = 1) {
  let from = start;
  const to = isNil(end) ? (step < 0 ? -Infinity : Infinity) : end;

  return {
    from,
    to,
    step,
    *[Symbol.iterator]() {
      let _from = from;
      const isPassed = (x) => (step < 0 ? x <= to : x >= to);
      while (!isPassed(_from)) {
        yield _from;
        _from += step;
      }
    },
  };
}
