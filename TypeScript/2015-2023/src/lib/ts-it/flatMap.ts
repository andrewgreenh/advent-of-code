export function flatMap<Input, Output>(
  transform: (item: Input) => Iterable<Output>,
) {
  return function* mappedValues(iter: Iterable<Input>) {
    for (let item of iter) {
      yield* transform(item);
    }
  };
}
