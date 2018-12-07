export function DefaultDict<T>(factory: () => T): ObjectOf<T> {
  const target: ObjectOf<T> = {};

  const handler = {
    get: (target, name) => {
      if (!(name in target)) target[name] = factory();
      return target[name];
    },
  };
  return new Proxy(target, handler);
}
