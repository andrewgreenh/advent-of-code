export function DefaultArray<T>(factory: () => T): Array<T> {
  const target: Array<T> = [];

  const handler = {
    get: (target, name) => {
      if (!(name in target)) target[name] = factory();
      return target[name];
    },
  };
  return new Proxy(target, handler);
}
