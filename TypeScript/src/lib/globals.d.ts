type Omit<TObject, TKey> = Pick<TObject, Exclude<keyof TObject, TKey>>;

type Nillable<T> = T | null | undefined;

type ObjectOf<T> = Record<any, T>;

type NonOptional<TObject> = { [K in keyof TObject]-?: TObject[K] };
