export function xor(...conditions: any[]) {
  return conditions.filter((c) => !!c).length === 1;
}
