/**
 * 开发和预览服务器上的在线搜索：浏览器请求 /live/search?q=…，服务器带上 .env.local 中的
 * Tavily 密钥向 Tavily 搜索，只把每个结果的标题、网址和摘录返回给浏览器。
 * 密钥只在服务器端使用，不会出现在网页、回答或日志中。
 */
import { LIVE_SEARCH_PATH, LIVE_STATUS } from "../src/webSearch.js";

const TAVILY_SEARCH_URL = "https://api.tavily.com/search";
// 每次向 Tavily 请求、在结果页显示的结果数
const LIVE_RESULT_COUNT = 10;
// Tavily 拒绝更长的搜索内容，超出的部分不发送
const MAX_QUERY_LENGTH = 400;
// 等待 Tavily 回答的最长时间
const TIMEOUT_MS = 15000;
// Tavily 的摘录有时留有 Markdown 标记：标题的 #、引用的 >、加粗的 ** 和 __；结果页只显示文字
const MARKDOWN_MARKS = /(^|\s)(?:#{1,6}|>)(?=\s|$)|\*\*|__/g;

/**
 * Vite 插件：在开发服务器（npm start）和预览服务器（npm run preview）上回答 /live/search。
 * @param {string | undefined} apiKey Tavily 密钥；没有时回答 nokey
 * @returns {import("vite").Plugin} 插件
 */
export function liveSearch(apiKey) {
  // 不返回任何值：Vite 把这两个钩子返回的函数当作在内置中间件之后才运行的钩子
  let mount = (server) => {
    server.middlewares.use(LIVE_SEARCH_PATH, (request, response) =>
      handleLiveSearch(request, response, apiKey, server.config.logger)
    );
  };
  return { name: "live-search", configureServer: mount, configurePreviewServer: mount };
}

/**
 * 回答一次在线搜索请求。回答为 JSON：成功时 {status: "ok", results}；否则 status 说明原因，
 * 取 src/webSearch.js 中 LIVE_STATUS 的值：nokey、badkey、limit 和 unavailable 是结果页要说明的
 * 正常情况，HTTP 状态为 200，浏览器不会把它们记为错误；只有请求本身无效时才回答 400、403 或
 * 405（badrequest、forbidden）。
 * @param {import("node:http").IncomingMessage} request 请求，网址不含 /live/search 前缀
 * @param {import("node:http").ServerResponse} response 回答
 * @param {string | undefined} apiKey Tavily 密钥
 * @param {{warn: function(string): void}} logger 服务器日志，记录 Tavily 的错误
 */
export async function handleLiveSearch(request, response, apiKey, logger) {
  if (request.method !== "GET") {
    return send(response, 405, { status: LIVE_STATUS.badrequest });
  }
  // 只回答本页发出的请求，其他网站不能借用密钥
  let site = request.headers["sec-fetch-site"];
  if (site && site !== "same-origin" && site !== "none") {
    return send(response, 403, { status: LIVE_STATUS.forbidden });
  }
  let query = (new URL(request.url, "http://localhost").searchParams.get("q") || "").trim();
  if (!query) {
    return send(response, 400, { status: LIVE_STATUS.badrequest });
  }
  if (!apiKey) {
    return send(response, 200, { status: LIVE_STATUS.nokey });
  }
  let tavily;
  try {
    tavily = await fetch(TAVILY_SEARCH_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query.slice(0, MAX_QUERY_LENGTH),
        search_depth: "basic",
        max_results: LIVE_RESULT_COUNT,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    logger.warn(`Live search: could not reach Tavily (${error.name})`);
    return send(response, 200, { status: LIVE_STATUS.unavailable });
  }
  if (!tavily.ok) {
    logger.warn(`Live search: Tavily answered HTTP ${tavily.status}`);
    return send(response, 200, { status: statusFor(tavily.status) });
  }
  let body;
  try {
    body = await tavily.json();
  } catch {
    logger.warn("Live search: Tavily's answer was not JSON");
    return send(response, 200, { status: LIVE_STATUS.unavailable });
  }
  return send(response, 200, { status: LIVE_STATUS.ok, results: cleanResults(body.results) });
}

/**
 * @param {number} httpStatus Tavily 回答的 HTTP 状态
 * @returns {string} 告诉浏览器的原因：badkey、limit 或 unavailable
 */
function statusFor(httpStatus) {
  if (httpStatus === 401) {
    return LIVE_STATUS.badkey;
  }
  // 432：免费计划或密钥的次数已用完；433：按量付费的上限已到
  if (httpStatus === 432 || httpStatus === 433) {
    return LIVE_STATUS.limit;
  }
  return LIVE_STATUS.unavailable;
}

/**
 * 只保留标题、网址和摘录都有效的结果，去掉摘录中的 Markdown 标记，并把文字中的换行和多余空格合并。
 * 标题原样传给页面（空标题也是），由页面决定怎么显示。
 * @param {unknown} results Tavily 回答中的 results
 * @returns {{title: string, url: string, content: string}[]} 结果
 */
function cleanResults(results) {
  if (!Array.isArray(results)) {
    return [];
  }
  return results
    .filter(
      (result) =>
        typeof result?.title === "string" &&
        typeof result.content === "string" &&
        isWebAddress(result.url)
    )
    .map(({ title, url, content }) => ({
      title: oneLine(title),
      url,
      content: oneLine(content.replace(MARKDOWN_MARKS, "$1")),
    }));
}

/**
 * @param {unknown} url 网址
 * @returns {boolean} 是否是 http 或 https 网址
 */
function isWebAddress(url) {
  try {
    let { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * @param {string} text 文字
 * @returns {string} 换行和连续空格合并为一个空格、去掉首尾空格的文字
 */
function oneLine(text) {
  return text.replace(/\s+/g, " ").trim();
}

/**
 * @param {import("node:http").ServerResponse} response 回答
 * @param {number} httpStatus HTTP 状态
 * @param {Object} body 回答的内容，以 JSON 发送
 */
function send(response, httpStatus, body) {
  response.statusCode = httpStatus;
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Cache-Control", "no-store");
  response.end(JSON.stringify(body));
}
