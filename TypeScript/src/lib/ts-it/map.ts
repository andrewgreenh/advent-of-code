export function map<Input, Output>(transform: (item: Input) => Output) {
  return function* mappedValues(iter: Iterable<Input>) {
    for (let item of iter) {
      yield transform(item)
    }
  }
}
