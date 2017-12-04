export function tapEach<T>(callback: (value: T) => any) {
  return function* tapped(iter: Iterable<T>) {
    for (const item of iter) {
      callback(item);
      yield item;
    }
  }
}
