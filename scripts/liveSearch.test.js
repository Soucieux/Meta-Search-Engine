// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import { handleLiveSearch, liveSearch } from "./liveSearch.js";

const KEY = "tvly-test-key";

/**
 * @param {number} status Tavily 回答的 HTTP 状态
 * @param {Object} body Tavily 回答的内容
 * @returns {Object} 代替 fetch 返回的回答
 */
function tavilyAnswer(status, body = {}) {
  return { ok: status >= 200 && status < 300, status, json: async () => body };
}

/**
 * 向在线搜索发出一次请求，Tavily 由假的 fetch 代替。
 * @param {string} url 请求的网址，不含 /live/search 前缀，例如 "/?q=burgers"
 * @param {{key?: string, method?: string, site?: string | null, tavily?: function}} options
 *   key 为 Tavily 密钥；method 为请求方法；site 为浏览器的 Sec-Fetch-Site（null 时不发送）；
 *   tavily 代替 fetch
 * @returns {Promise<{status: number, headers: Object, body: Object, raw: string, fetch: Object, warn: Object}>}
 *   回答的状态、标题和内容，以及记录调用的 fetch 和日志
 */
async function ask(url, { key = KEY, method = "GET", site = "same-origin", tavily } = {}) {
  let fetch = vi.fn(tavily ?? (async () => tavilyAnswer(200, { results: [] })));
  vi.stubGlobal("fetch", fetch);
  let warn = vi.fn();
  let answer = { headers: {} };
  let response = {
    setHeader: (name, value) => (answer.headers[name] = value),
    end: (text) => (answer.raw = text),
  };
  let request = { method, url, headers: site === null ? {} : { "sec-fetch-site": site } };
  await handleLiveSearch(request, response, key, { warn });
  return { ...answer, status: response.statusCode, body: JSON.parse(answer.raw), fetch, warn };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("live search", () => {
  it("asks Tavily with the key and returns each result's title, address and excerpt, the title as is", async () => {
    let answer = await ask("/?q=%20best%20burgers%20", {
      tavily: async () =>
        tavilyAnswer(200, {
          results: [
            { title: " Best\n burgers ", url: "https://www.example.com/a", content: "Line one\n\nline two", score: 0.9 },
            { title: "", url: "https://www.untitled.com/", content: "No title" },
            { title: "No address", content: "Skipped" },
            { title: "Other protocol", url: "ftp://example.com/file", content: "Skipped" },
          ],
        }),
    });

    expect(answer.status).toBe(200);
    expect(answer.headers["Cache-Control"]).toBe("no-store");
    expect(answer.body).toEqual({
      status: "ok",
      results: [
        { title: "Best burgers", url: "https://www.example.com/a", content: "Line one line two" },
        { title: "", url: "https://www.untitled.com/", content: "No title" },
      ],
    });
    let [url, options] = answer.fetch.mock.calls[0];
    expect(url).toBe("https://api.tavily.com/search");
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe(`Bearer ${KEY}`);
    expect(JSON.parse(options.body)).toEqual({
      query: "best burgers",
      search_depth: "basic",
      max_results: 10,
    });
  });

  it("removes the Markdown marks Tavily sometimes leaves in an excerpt", async () => {
    let answer = await ask("/?q=pizza", {
      tavily: async () =>
        tavilyAnswer(200, {
          results: [
            {
              title: "Pi Squared",
              url: "https://pizza.example.com/",
              content: "## Review by - Google ### five star review by Caroline S: > Ordered **2** half __slabs__. C# fans too.",
            },
          ],
        }),
    });

    expect(answer.body.results[0].content).toBe(
      "Review by - Google five star review by Caroline S: Ordered 2 half slabs. C# fans too."
    );
  });

  it("sends Tavily at most 400 characters of the query", async () => {
    let answer = await ask(`/?q=${"a".repeat(450)}`);

    expect(JSON.parse(answer.fetch.mock.calls[0][1].body).query).toHaveLength(400);
  });

  it("answers requests the browser makes from the page or directly", async () => {
    for (let site of ["same-origin", "none", null]) {
      expect((await ask("/?q=burgers", { site })).status).toBe(200);
    }
  });

  it("says no key is set without asking Tavily", async () => {
    // .env.local 中没有密钥或 TAVILY_API_KEY= 后为空
    let answer = await ask("/?q=burgers", { key: "" });

    expect(answer.status).toBe(200);
    expect(answer.body).toEqual({ status: "nokey" });
    expect(answer.fetch).not.toHaveBeenCalled();
  });

  it("refuses other websites, other methods and empty queries without asking Tavily", async () => {
    let answers = [
      await ask("/?q=burgers", { site: "cross-site" }),
      await ask("/?q=burgers", { site: "same-site" }),
      await ask("/?q=burgers", { method: "POST" }),
      await ask("/?q=%20%20"),
      await ask("/"),
    ];

    expect(answers.map((answer) => [answer.status, answer.body.status])).toEqual([
      [403, "forbidden"],
      [403, "forbidden"],
      [405, "badrequest"],
      [400, "badrequest"],
      [400, "badrequest"],
    ]);
    answers.forEach((answer) => expect(answer.fetch).not.toHaveBeenCalled());
  });

  it("turns Tavily's errors into reasons the page can explain, without showing the key", async () => {
    let reasons = {};
    for (let status of [401, 429, 432, 433, 500]) {
      let answer = await ask("/?q=burgers", { tavily: async () => tavilyAnswer(status) });
      reasons[status] = answer.body.status;
      expect(answer.status).toBe(200);
      expect(answer.warn).toHaveBeenCalledWith(`Live search: Tavily answered HTTP ${status}`);
      expect(answer.raw).not.toContain(KEY);
      expect(answer.warn.mock.calls.flat().join(" ")).not.toContain(KEY);
    }

    expect(reasons).toEqual({
      401: "badkey",
      429: "unavailable",
      432: "limit",
      433: "limit",
      500: "unavailable",
    });
  });

  it("says live search is unavailable when Tavily cannot be reached or answers with something else", async () => {
    let unreachable = await ask("/?q=burgers", {
      tavily: async () => {
        throw new TypeError("fetch failed");
      },
    });
    let notJson = await ask("/?q=burgers", {
      tavily: async () => ({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError("Unexpected token <");
        },
      }),
    });
    let noResults = await ask("/?q=burgers", { tavily: async () => tavilyAnswer(200, {}) });

    expect(unreachable.body).toEqual({ status: "unavailable" });
    expect(unreachable.warn).toHaveBeenCalledWith("Live search: could not reach Tavily (TypeError)");
    expect(notJson.body).toEqual({ status: "unavailable" });
    expect(noResults.body).toEqual({ status: "ok", results: [] });
  });

  it("serves /live/search on both the development and the preview server", () => {
    let plugin = liveSearch(KEY);
    // 与 connect 一样，use 返回中间件应用本身（一个函数）
    let use = vi.fn(() => () => {});
    let server = { middlewares: { use }, config: { logger: { warn: vi.fn() } } };

    let hooks = [plugin.configureServer(server), plugin.configurePreviewServer(server)];

    expect(use.mock.calls.map(([path]) => path)).toEqual(["/live/search", "/live/search"]);
    // 返回函数会被 Vite 当作在内置中间件之后才运行的钩子
    expect(hooks).toEqual([undefined, undefined]);
  });
});
