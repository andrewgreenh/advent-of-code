export function startWith<Input>(firstIter: Iterable<Input>) {
  return function* startedWith(laterIter: Iterable<Input>) {
    yield* firstIter;
    yield* laterIter;
  };
}
