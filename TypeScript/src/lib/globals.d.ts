type Omit<TObject, TKey> = Pick<TObject, Exclude<keyof TObject, TKey>>
