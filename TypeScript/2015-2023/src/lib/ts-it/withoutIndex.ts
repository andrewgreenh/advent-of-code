import { enumerate } from './enumerate';

export function withoutIndex<T>(i: number) {
  return function* withoutIndexGenerator(iterable: Iterable<T>) {
    for (const [index, item] of enumerate(iterable)) {
      if (index === i) continue;
      yield item;
    }
  };
}
