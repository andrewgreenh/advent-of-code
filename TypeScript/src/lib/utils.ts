export function whenPresent<T, R>(
  value: T | null | undefined,
  then: (value: T) => R,
): R | null | undefined {
  if (value === null || value === undefined) return value as null | undefined;
  return then(value);
}

export function keys<ObjectType extends {}>(
  o: ObjectType,
): (keyof ObjectType)[] {
  return Object.keys(o) as (keyof ObjectType)[];
}

export function values<ObjectType extends {}>(
  o: ObjectType,
): ObjectType[keyof ObjectType][] {
  return Object.values(o) as ObjectType[keyof ObjectType][];
}

export function typesafeKeyBy<
  IterableType extends Iterable<any>,
  Key extends keyof IterableItem<IterableType>,
>(
  a: IterableType,
  key: Key,
): Record<IterableItem<IterableType>[Key], IterableItem<IterableType>> {
  const result = {};
  for (const current of a) {
    result[current[key]] = current;
  }
  return result as Record<
    IterableItem<IterableType>[Key],
    IterableItem<IterableType>
  >;
}

export type IterableItem<IterableType> = IterableType extends Iterable<infer U>
  ? U
  : never;

export function isTruthy<Value>(
  x: Value,
): x is Exclude<Value, null | undefined | false | 0> {
  return Boolean(x);
}

export function typecheck<Value>(v: Value): Value {
  return v;
}
