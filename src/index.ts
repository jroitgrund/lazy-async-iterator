(Symbol as any).asyncIterator = Symbol.asyncIterator || Symbol.for("Symbol.asyncIterator");

export interface IAsyncFetcher<T, R, P> {
    get: (after?: T) => Promise<P>;
    getToken: (page: P) => T;
    getResults: (page: P) => R[];
}

export async function* getInfiniteStream<T, R, P>(asyncFetcher: IAsyncFetcher<T, R, P>) {
    let token: T | undefined;
    while (true) {
        const page = await asyncFetcher.get(token as T);
        token = asyncFetcher.getToken(page);
        yield* asyncFetcher.getResults(page);
    }
}
