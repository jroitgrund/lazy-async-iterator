# lazy-async-iterator

[![CircleCI](https://circleci.com/gh/jroitgrund/lazy-async-iterator.svg?style=svg)](https://circleci.com/gh/jroitgrund/lazy-async-iterator)

Turn a paginated async call into an infinite lazy result iterator.

```ts
async function getHmmmPosts(token?: number) {
    const url = `https://reddit.com/r/hmmm/hot.json${token ? `?after=${token}` : ""}`;
    const page = await (await fetch(url)).json();
    const posts = page.data.children;
    const nextToken = page.data.after;
    return Promise.resolve({
        nextToken,
        posts,
    });
}

const hmmmPostsAsyncFetcher = {
    get: getHmmmPosts,
    getResults: (page: IPage) => page.posts,
    getToken: (page: IPage) => page.nextToken,
};

describe("getInfiniteStream", () => {
    it("returns an infinite stream", async () => {
        const iterator = getInfiniteStream(hmmmPostsAsyncFetcher)[Symbol.iterator]();
        const titles: string[] = [];
        for (let i = 0; i < 1000; i++) {
            titles.push((await iterator.next()).value.data.title);
        }
        expect(titles).toEqual(_.fill(Array(100), "hmmm"););
    });
});
```

This library requires an implementation of `Promise` and of ES6 iterators.