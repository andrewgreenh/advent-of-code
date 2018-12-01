type Omit<TObject, TKey> = Pick<TObject, Exclude<keyof TObject, TKey>>;

type Nillable<T> = T | null | undefined;
