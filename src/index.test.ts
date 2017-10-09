import { getInfiniteStream } from "./index";

interface IPage {
    posts: number[];
    after: number;
}

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
        const results: number[] = [];
        for await (const result of getInfiniteStream(postsAsyncFetcher)) {
            results.push(result);
            if (results.length === 10) {
                break;
            }
        }
        expect(results).toEqual([0, 0, 10, 11, 20, 22, 30, 33, 40, 44]);
    });
});
