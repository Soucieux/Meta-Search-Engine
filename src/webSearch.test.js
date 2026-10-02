import { afterEach, describe, expect, it, vi } from "vitest";
import { highlightSegments, queryTerms, searchWeb } from "./webSearch";

// 测试用的 Tavily 结果
const WEATHER = { title: "Weather today", url: "https://www.weather.com/today", content: "Sunny skies" };
const RECIPES = { title: "Burger recipes", url: "https://www.recipes.com/burgers", content: "Grill the beef" };
const DINER = { title: "Best burger in town", url: "https://www.diner.com/", content: "A cheeseburger diner" };

/**
 * 代替浏览器的 fetch：开发服务器的在线搜索。
 * @param {{live: Object | Error}} options live 为在线搜索的回答，为 Error 时请求失败
 * @returns {function} fetch
 */
function fakeFetch({ live }) {
  return vi.fn(async () => {
    if (live instanceof Error) {
      throw live;
    }
    return { json: async () => live };
  });
}

/**
 * @param {Object[]} results Tavily 的结果
 * @returns {Object} 开发服务器成功时的回答
 */
function liveAnswer(results) {
  return { status: "ok", results };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("searchWeb", () => {
  it("asks the development server and keeps Tavily's order", async () => {
    let fetch = fakeFetch({ live: liveAnswer([WEATHER, RECIPES, DINER]) });
    vi.stubGlobal("fetch", fetch);

    let search = await searchWeb("best burgers");

    expect(fetch).toHaveBeenCalledWith("/live/search?q=best%20burgers");
    expect(search.status).toBe("ok");
    expect(search.results.map((result) => result.title)).toEqual([
      WEATHER.title,
      RECIPES.title,
      DINER.title,
    ]);
  });

  it("gives each result the fields the results page and My Pages use", async () => {
    let page = {
      title: "Local news",
      url: "https://www.example.com/news/local/today/story.html?id=1",
      content: "The council met on Tuesday.",
    };
    vi.stubGlobal("fetch", fakeFetch({ live: liveAnswer([page]) }));

    let [result] = (await searchWeb("council")).results;

    expect(result).toEqual({
      engine: "Web",
      position: 0,
      title: "Local news",
      link: page.url,
      displayed_link: "www.example.com › news › local › today",
      domain: "www.example.com",
      snippet: "The council met on Tuesday.",
    });
  });

  it("starts the snippet shortly before a search word that comes late in a long excerpt", async () => {
    let content = "Filler words come first. ".repeat(12) + "The burger arrives late in this excerpt.";
    vi.stubGlobal("fetch", fakeFetch({ live: liveAnswer([{ ...RECIPES, content }]) }));

    let [result] = (await searchWeb("burger")).results;

    expect(result.snippet.startsWith("…")).toBe(true);
    expect(result.snippet).toContain("burger arrives late");
    expect(result.snippet.length).toBeLessThanOrEqual(221);
  });

  it("passes on why live search has no results", async () => {
    vi.stubGlobal("fetch", fakeFetch({ live: { status: "limit" } }));

    expect(await searchWeb("burger")).toEqual({ status: "limit", results: [] });
  });

  it("treats a failed request or an answer it does not know as unavailable", async () => {
    for (let live of [new TypeError("Failed to fetch"), { status: "forbidden" }, { status: "ok" }]) {
      vi.stubGlobal("fetch", fakeFetch({ live }));

      expect((await searchWeb("burger")).status).toBe("unavailable");
    }
  });
});

describe("queryTerms", () => {
  it("lowercases, drops common words and repeats, and keeps numbers", () => {
    expect(queryTerms("How to grill THE best Burgers in 2019 burgers")).toEqual([
      "grill",
      "best",
      "burgers",
      "2019",
    ]);
  });

  it("returns no terms for a query of common words only", () => {
    expect(queryTerms("what is the")).toEqual([]);
  });
});

describe("highlightSegments", () => {
  it("bolds every whole word that starts with a search term, in any case", () => {
    expect(highlightSegments("Burgers and burger buns", ["burger"])).toEqual([
      { text: "Burgers", bold: true },
      { text: " and ", bold: false },
      { text: "burger", bold: true },
      { text: " buns", bold: false },
    ]);
  });

  it("leaves words that only contain a term inside them plain", () => {
    expect(highlightSegments("hamburger", ["burger"])).toEqual([
      { text: "hamburger", bold: false },
    ]);
  });

  it("treats regular-expression characters in terms as plain text", () => {
    expect(highlightSegments("abc and a.c", ["a.c"])).toEqual([
      { text: "abc and ", bold: false },
      { text: "a.c", bold: true },
    ]);
  });
});
