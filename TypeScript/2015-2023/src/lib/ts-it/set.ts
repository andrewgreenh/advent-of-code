export function set<T>(object: T, key: keyof T, value: T[keyof T]) {
  object[key] = value;
  return object;
}
