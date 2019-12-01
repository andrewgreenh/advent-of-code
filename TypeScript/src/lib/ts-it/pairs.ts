import { typesafeKeys } from '../utils';

export function toPairs<Object>(
  o: Object,
): ReadonlyArray<Readonly<[keyof Object, Object[keyof Object]]>> {
  return typesafeKeys(o).map(key => [key, o[key]] as const);
}

export function fromPairs<Tuple extends [any, any]>(
  pairs: Iterable<Tuple>,
): Record<Tuple[0], Tuple[1]> {
  let result = {} as Record<Tuple[0], Tuple[1]>;
  for (const [key, value] of pairs) {
    result[key] = value;
  }
  return result;
}
