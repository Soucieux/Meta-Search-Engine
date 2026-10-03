/**
 * 浏览器 local storage 中保存的数据：每一项的键，读写的函数，以及几个页面共用的读写。
 * 键只在这里出现一次；页面通过这些名称和函数读写，不再各自书写键名，也不直接使用 localStorage。
 * 值以 JSON 存放，与 2021 年以来保存的数据格式相同。
 */

// 搜索框的内容，每次输入时保存；进入主页时清除
export const CURRENT_INPUT = "current input";
// 上一次搜索的内容；与搜索框的内容不同时发起新的搜索
export const PREVIOUS_INPUT = "previous input";
// 是否显示 Web 来源的结果；页面载入时重设为显示
export const SHOW_WEB_RESULTS = "show web results";
// 网站筛选中未勾选的网站（结果中的 domain）
export const EXCLUDED_WEBSITES = "exclude websites";
// 上一次搜索的结果，返回结果页或刷新时显示
export const WEB_RESULTS = "web results";
// 上一次搜索的状态 {status}，在线搜索没有结果时说明原因
export const WEB_SEARCH = "web search";
// 已收藏的网页：完整的搜索结果，按收藏的先后排列
export const FAVOURITE_WEBSITES = "favourite websites";

/**
 * 读取一项。
 * @param {string} key 键
 * @returns {*} 保存的值；没有保存过，或保存的内容不是 JSON 时为 null
 */
export function read(key) {
  let raw = localStorage.getItem(key);
  if (raw === null) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * 保存一项，以 JSON 存放。
 * @param {string} key 键
 * @param {*} value 要保存的值
 */
export function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 删除一项。
 * @param {string} key 键
 */
export function remove(key) {
  localStorage.removeItem(key);
}

/**
 * @returns {string[]} 网站筛选中未勾选的网站；没有记录时为空
 */
export function excludedWebsites() {
  return read(EXCLUDED_WEBSITES) || [];
}

/**
 * @returns {Object[]} 已收藏的网页；没有收藏时为空
 */
export function favourites() {
  return read(FAVOURITE_WEBSITES) || [];
}

/**
 * 收藏一条搜索结果，或在它已收藏时取消收藏。网页以链接识别，同一网页不会收藏两次。
 * @param {Object} result 搜索结果
 * @returns {boolean} 操作之后是否已收藏
 */
export function toggleFavourite(result) {
  let saved = favourites();
  let isSaved = saved.some((page) => page.link === result.link);
  write(
    FAVOURITE_WEBSITES,
    isSaved ? saved.filter((page) => page.link !== result.link) : saved.concat(result)
  );
  return !isSaved;
}

/**
 * 从已收藏的网页中移除一个网页（按链接识别）。
 * @param {Object} page 要移除的网页
 * @returns {Object[]} 移除之后已收藏的网页
 */
export function removeFavourite(page) {
  let remaining = favourites().filter((saved) => saved.link !== page.link);
  write(FAVOURITE_WEBSITES, remaining);
  return remaining;
}
