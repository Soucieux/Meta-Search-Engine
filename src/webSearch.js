/**
 * 网页搜索：开发服务器（scripts/liveSearch.js）带上 Tavily 密钥向 Tavily 搜索在线网页，
 * 结果按 Tavily 的顺序显示。也提供结果页使用的搜索词和摘要加粗。
 */

// 搜索来源的名称，也是搜索结果的 engine 字段
export const WEB = "Web";
// 开发服务器上的在线搜索地址；Tavily 密钥只保存在服务器端
export const LIVE_SEARCH_PATH = "/live/search";
// 结果页注明结果来自 Tavily 时链接到这里
export const TAVILY_URL = "https://tavily.com";

// 开发服务器说明在线搜索为什么没有结果时使用的状态
const LIVE_STATUSES = new Set(["nokey", "badkey", "limit", "unavailable"]);
const SNIPPET_LENGTH = 220;
// 搜索词出现在摘录较后的位置时，摘要从它之前这么多个字符开始
const SNIPPET_LEAD = 60;
// 显示地址中网站之后最多显示的路径段数
const ADDRESS_PARTS = 3;
// 网址路径段常见的文件扩展名，不显示在地址中
const FILE_EXTENSION = /\.(html?|php|aspx?|jsp|cfm|shtml)$/i;
// 不作为搜索词的常用词
const STOP_WORDS = new Set(
  "a an and are as at be by for from how in is it of on or that the this to was what when where which who why with".split(
    " "
  )
);

/**
 * 搜索在线网页。
 * @param {string} query 搜索内容
 * @returns {Promise<{status: "ok" | "nokey" | "badkey" | "limit" | "unavailable", results: Object[]}>}
 *   按 Tavily 的顺序排列的搜索结果（字段与收藏的网页相同）；status 不是 "ok" 时说明在线搜索为什么没有结果
 */
export async function searchWeb(query) {
  let live = await fetchLiveResults(query);
  if (live.status !== "ok") {
    return { status: live.status, results: [] };
  }
  let terms = queryTerms(query);
  return {
    status: "ok",
    results: live.results.map((result, index) => toResult(result, index, terms)),
  };
}

/**
 * 向开发服务器请求在线搜索结果。
 * @param {string} query 搜索内容
 * @returns {Promise<{status: string, results?: {title: string, url: string, content: string}[]}>}
 *   status 为 "ok" 时带有 Tavily 的结果；服务器没有回答或回答无法识别时为 "unavailable"
 */
async function fetchLiveResults(query) {
  try {
    let response = await fetch(`${LIVE_SEARCH_PATH}?q=${encodeURIComponent(query)}`);
    let body = await response.json();
    if (body.status === "ok" && Array.isArray(body.results)) {
      return body;
    }
    return { status: LIVE_STATUSES.has(body.status) ? body.status : "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}

/**
 * @param {{title: string, url: string, content: string}} result Tavily 的结果
 * @param {number} index 结果在 Tavily 返回的结果中的位置，用作结果的唯一编号
 * @param {string[]} terms 搜索词
 * @returns {Object} 结果页和已收藏网页使用的搜索结果
 */
function toResult({ title, url, content }, index, terms) {
  let address = new URL(url);
  return {
    engine: WEB,
    position: index,
    title,
    link: url,
    displayed_link: displayedLink(address),
    domain: address.hostname,
    snippet: snippetFor(content, terms),
  };
}

/**
 * @param {URL} address 网址
 * @returns {string} 结果上方显示的地址，例如 "www.example.com › news › local-news"
 */
function displayedLink(address) {
  let parts = address.pathname
    .split("/")
    .map((part) => {
      try {
        return decodeURIComponent(part);
      } catch {
        return part;
      }
    })
    .map((part) => part.replace(FILE_EXTENSION, ""))
    .filter(Boolean);
  return [address.hostname, ...parts.slice(0, ADDRESS_PARTS)].join(" › ");
}

/**
 * @param {string} query 搜索内容
 * @returns {string[]} 小写、去重、去掉常用词的搜索词
 */
export function queryTerms(query) {
  let words = query.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  return [...new Set(words.filter((word) => word.length > 1 && !STOP_WORDS.has(word)))];
}

/**
 * 摘要：摘录开头；第一个搜索词出现得较晚时，从它之前不远处开始，使搜索词出现在摘要中。
 * @param {string} text 网页摘录
 * @param {string[]} terms 搜索词
 * @returns {string} 摘要
 */
function snippetFor(text, terms) {
  let lower = text.toLowerCase();
  let first = Math.min(...terms.map((term) => lower.indexOf(term)).filter((at) => at >= 0));
  if (!Number.isFinite(first) || first < SNIPPET_LENGTH - SNIPPET_LEAD) {
    return clip(text, SNIPPET_LENGTH);
  }
  let start = text.lastIndexOf(" ", first - SNIPPET_LEAD);
  return "…" + clip(text.slice(start + 1), SNIPPET_LENGTH);
}

/**
 * 把摘要分成普通文字和加粗的搜索词（以搜索词开头的整个单词加粗），供结果页渲染。
 * @param {string} text 摘要
 * @param {string[]} terms 搜索词
 * @returns {{text: string, bold: boolean}[]} 依次排列的文字片段
 */
export function highlightSegments(text, terms) {
  if (terms.length === 0) {
    return [{ text, bold: false }];
  }
  let pattern = new RegExp(`\\b(?:${terms.map(escapeRegExp).join("|")})[\\p{L}\\p{N}]*`, "giu");
  let segments = [];
  let last = 0;
  for (let match of text.matchAll(pattern)) {
    if (match.index > last) {
      segments.push({ text: text.slice(last, match.index), bold: false });
    }
    segments.push({ text: match[0], bold: true });
    last = match.index + match[0].length;
  }
  if (last < text.length) {
    segments.push({ text: text.slice(last), bold: false });
  }
  return segments;
}

/**
 * @param {string} text 文字
 * @param {number} maxLength 最大长度
 * @returns {string} 原文，或在最大长度前的空格处截断并加上省略号
 */
function clip(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  let cut = text.lastIndexOf(" ", maxLength - 1);
  return text.slice(0, cut > 0 ? cut : maxLength - 1) + "…";
}

/**
 * @param {string} text 文字
 * @returns {string} 可以放进正则表达式的文字
 */
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
