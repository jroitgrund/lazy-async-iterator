export interface IAsyncIterable<T> {
    [Symbol.iterator]: () => IAsyncIterator<T>;
}

export interface IAsyncIterator<T> {
    next: () => Promise<{ done: boolean; value: T }>;
}

export interface IAsyncFetcher<T, R, P> {
    get: (after?: T) => Promise<P>;
    getToken: (page: P) => T;
    getResults: (page: P) => R[];
}

export function getInfiniteStream<T, R, P>(
    asyncFetcher: IAsyncFetcher<T, R, P>
): IAsyncIterable<R> {
    let currentResultsIterator: Iterator<R> = [][Symbol.iterator]();
    let nextToken: T;

    return {
        [Symbol.iterator]: () => ({
            next(): Promise<{ done: boolean; value: R }> {
                const { done, value } = currentResultsIterator.next();
                if (done) {
                    return asyncFetcher.get(nextToken).then(page => {
                        nextToken = asyncFetcher.getToken(page);
                        const results = asyncFetcher.getResults(page);
                        currentResultsIterator = results[Symbol.iterator]();
                        return {
                            done: false,
                            value: currentResultsIterator.next().value,
                        };
                    });
                } else {
                    return Promise.resolve({
                        done: false,
                        value,
                    });
                }
            },
        }),
    };
}
