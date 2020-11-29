export function tap<T>(callback: (arg: T) => any): (a: T) => T {
  return (x) => {
    callback(x);
    return x;
  };
}
