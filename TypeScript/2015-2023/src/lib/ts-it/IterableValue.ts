export type IterableValue<T extends Iterable<any>> = T extends Iterable<
  infer Inner
>
  ? Inner
  : never;
