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
        const results = [];
        for await (const result of getInfiniteStream(hmmmPostsAsyncFetcher)) {
            results.push(result.data.title);
            if (results.length === 100) {
                break;
            }
        }
        expect(titles).toEqual(_.fill(Array(100), "hmmm"););
    });
});
```

This library requires an implementation of `Promise` and of ES6 iterators.