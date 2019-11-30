type Nillable<T> = T | null | undefined;

type ObjectOf<T> = Record<any, T>;

type NonOptional<TObject> = { [K in keyof TObject]-?: TObject[K] };
