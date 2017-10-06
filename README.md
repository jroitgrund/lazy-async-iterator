# lazy-async-iterator

[![CircleCI](https://circleci.com/gh/jroitgrund/lazy-async-iterator.svg?style=svg)](https://circleci.com/gh/jroitgrund/lazy-async-iterator)

Turn a paginated async call into an infinite lazy stream of results:

```ts
function getPosts(after?: number) {
    const start = after || 0;
    return Promise.resolve({
        after: start + 1,
        posts: [start * 10, start * 11],
    });
}

const postsAsyncFetcher = {
    get: getPosts,
    getResults: (page: IPage) => page.posts,
    getToken: (page: IPage) => page.after,
};

describe("getInfiniteStream", () => {
    it("returns an infinite stream", async () => {
        const iterator = getInfiniteStream(postsAsyncFetcher)[Symbol.iterator]();
        const results: number[] = [];
        for (let i = 0; i < 10; i++) {
            results.push((await iterator.next()).value);
        }
        expect(results).toEqual([0, 0, 10, 11, 20, 22, 30, 33, 40, 44]);
    });
});
```

This library requires an implementation of `Promise` and of ES6 iterators.