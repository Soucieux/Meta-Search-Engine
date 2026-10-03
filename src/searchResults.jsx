import React from "react";
import "./searchResults.css";
import { Navigate } from "react-router";
import Address from "./address";
import EmptyState from "./emptyState";
import { CloseIcon, FunnelIcon, StarFillIcon, StarIcon } from "./icons";
import { HOME_PATH } from "./routes";
import { LIVE_STATUS, TAVILY_URL, highlighter, queryTerms, searchWeb } from "./webSearch";
import {
  CURRENT_INPUT,
  EXCLUDED_WEBSITES,
  PREVIOUS_INPUT,
  SHOW_WEB_RESULTS,
  WEB_RESULTS,
  WEB_SEARCH,
  excludedWebsites,
  favourites,
  read,
  toggleFavourite,
  write,
} from "./storage";

// 在线搜索没有结果时，状态行和结果位置的说明，按开发服务器给出的原因
const UNAVAILABLE = {
  [LIVE_STATUS.nokey]: {
    heading: "Live search needs a Tavily key",
    body: "Create a free key at tavily.com, add it to .env.local as TAVILY_API_KEY, then search again, as the README describes.",
  },
  [LIVE_STATUS.badkey]: {
    heading: "Tavily didn't accept the key",
    body: "Check TAVILY_API_KEY in .env.local, then search again.",
  },
  [LIVE_STATUS.limit]: {
    heading: "This month's free searches are used up",
    body: "Tavily's free plan resets every month; search again after it does.",
  },
  [LIVE_STATUS.unavailable]: {
    heading: "Live search didn't answer",
    body: "Check the internet connection and that npm start is still running, then search again.",
  },
};

/**
 * 网站筛选：搜索结果中的每个网站一行，带勾选框、结果数和比例条；取消勾选即隐藏该网站的结果。
 * @param {{results: Object[], excluded: string[], onToggle: function(string): void}} props
 *   results 为网站筛选之前的全部搜索结果；excluded 为未勾选的网站；
 *   onToggle 在勾选或取消勾选一个网站时调用，参数为网站
 * @returns {React.ReactElement} 网站筛选
 */
function WebsitesFilter({ results, excluded, onToggle }) {
  // 每个网站的结果数，按网站在结果中首次出现的顺序
  let counts = new Map();
  for (let result of results) {
    counts.set(result.domain, (counts.get(result.domain) || 0) + 1);
  }
  let maxCount = Math.max(1, ...counts.values());
  return (
    <aside className="filter" aria-labelledby="websites-filter-title">
      <h2 id="websites-filter-title" className="label-mono">
        Websites Filter
      </h2>
      {counts.size === 0 ? (
        <div className="filter__empty">
          <p>No websites</p>
          <p>Websites appear here when there are results to filter.</p>
        </div>
      ) : (
        <ul className="filter__list">
          {[...counts].map(([website, count]) => (
            <li key={website}>
              <label className="filter__row">
                <input
                  type="checkbox"
                  checked={!excluded.includes(website)}
                  onChange={() => onToggle(website)}
                />
                <span className="filter__name">{website}</span>
                <span className="filter__count">
                  {count}
                  <span className="visually-hidden"> results</span>
                </span>
                <span
                  className="filter__bar"
                  aria-hidden="true"
                  style={{ "--pct": (count / maxCount) * 100 + "%" }}
                />
              </label>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}

/**
 * 一条搜索结果及其收藏按钮。已收藏的结果带有背景色和 Saved 标签。
 * 点击收藏按钮时只重新渲染这条结果，不会重新渲染整个结果页。
 * props：result 为要显示的搜索结果；number 为它在列表中的序号（从 1 开始）；
 * highlight 把摘要分成普通文字和加粗的搜索词；saved 为渲染时它是否已收藏。
 */
class SearchResult extends React.Component {
  /**
   * @param {{result: Object, number: number, highlight: function(string): {text: string, bold: boolean}[], saved: boolean}} props 见类的说明
   */
  constructor(props) {
    super(props);
    this.state = { saved: props.saved };
  }

  /**
   * 收藏或取消收藏这条搜索结果，并按结果更新按钮和背景色。
   */
  #handleClick = () => {
    this.setState({ saved: toggleFavourite(this.props.result) });
  };

  render() {
    let { result, number, highlight } = this.props;
    let { saved } = this.state;
    // 收藏按钮以标题作为说明，读屏软件会读出它收藏的是哪一条结果
    let titleId = "result-title-" + result.position;
    return (
      <li>
        <article className={saved ? "result result--saved" : "result"}>
          <span className="result__num meta-mono" aria-hidden="true">
            {String(number).padStart(2, "0")}
          </span>
          <div className="result__body">
            <p className="result__address meta-mono">
              <span className="result__url">
                <Address result={result} />
              </span>
              {saved && (
                <span className="saved-tag">
                  <StarFillIcon size={11} />
                  Saved
                </span>
              )}
            </p>
            <h3 className="result__title">
              <a
                id={titleId}
                href={result.link}
                className="link-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {result.title}{" "}
                <span className="visually-hidden">(opens in a new tab)</span>
              </a>
            </h3>
            <p className="result__snippet">
              {highlight(result.snippet).map((segment, index) =>
                segment.bold ? <b key={index}>{segment.text}</b> : segment.text
              )}
            </p>
          </div>
          <button
            type="button"
            className={saved ? "btn-remove btn-red" : "btn-favourite"}
            aria-describedby={titleId}
            onClick={this.#handleClick}
          >
            {saved ? <CloseIcon /> : <StarIcon />}
            {saved ? "Remove" : "Favourite"}
          </button>
        </article>
      </li>
    );
  }
}

/**
 * 搜索结果：左侧网站筛选，右侧状态行和结果列表。搜索框的内容与上一次搜索的内容不同时搜索在线网页；
 * 没有搜索内容时返回主页。显示哪些结果由 local storage 中的来源状态和网站筛选决定。
 */
class SearchResults extends React.Component {
  // 上一次搜索的结果，网站筛选之前；返回结果页或刷新时是上一次保存的结果
  #results = read(WEB_RESULTS) || [];
  // 正在进行的搜索的编号；连续搜索时只采用最后一次的结果
  #latestSearch = 0;
  // 网页搜索还没有返回时为 true
  #searching = false;

  constructor(props) {
    super(props);
    this.state = {};
  }

  /**
   * 搜索在线网页；结果返回后保存，并重新渲染结果页。
   * @param {string} query 搜索内容
   */
  #runSearch(query) {
    let searchId = ++this.#latestSearch;
    this.#searching = true;
    this.#results = [];
    searchWeb(query).then((search) => {
      if (searchId !== this.#latestSearch) {
        return;
      }
      this.#searching = false;
      write(WEB_RESULTS, search.results);
      write(WEB_SEARCH, { status: search.status });
      this.#results = search.results;
      this.setState({ searchedAt: Date.now() });
    });
  }

  /**
   * 勾选或取消勾选网站筛选中的一个网站，并重新渲染结果页。
   * @param {string} website 网站
   */
  #toggleWebsite = (website) => {
    let excluded = excludedWebsites();
    write(
      EXCLUDED_WEBSITES,
      excluded.includes(website) ? excluded.filter((w) => w !== website) : excluded.concat(website)
    );
    this.forceUpdate();
  };

  /**
   * 把已收藏的搜索结果排在前面，两部分各自保持原来的顺序。
   * 在结果页渲染时排序，因此收藏或取消收藏后，结果页下次渲染时才移动这条结果。
   * @param {Object[]} results 要显示的搜索结果
   * @param {Set<string>} saved 已收藏网页的链接
   * @returns {Object[]} 排序后的新数组，传入的数组不变
   */
  #orderFavouritesFirst(results, saved) {
    return results
      .filter((result) => saved.has(result.link))
      .concat(results.filter((result) => !saved.has(result.link)));
  }

  /**
   * 结果列表上方的状态行：正在搜索，在线搜索为什么没有结果，网页结果已隐藏，
   * 或显示了多少条结果和隐藏了几个网站。
   * @param {string} query 当前的搜索内容
   * @param {{heading: string} | undefined} unavailable 在线搜索没有结果的原因
   * @param {boolean} showWeb 是否显示 Web 来源的结果
   * @param {number} shown 显示的结果数
   * @param {number} hidden 隐藏的网站数
   * @returns {string} 状态行文字
   */
  #statusText(query, unavailable, showWeb, shown, hidden) {
    if (this.#searching) {
      return "Searching the web…";
    }
    if (unavailable) {
      return unavailable.heading;
    }
    if (!showWeb) {
      return "Web results hidden";
    }
    let total = this.#results.length;
    if (hidden === 0) {
      return `${total} results · “${query}”`;
    }
    if (shown === 0) {
      return `0 of ${total} results · all websites hidden`;
    }
    return `${shown} of ${total} results · ${hidden} website${hidden === 1 ? "" : "s"} hidden`;
  }

  /**
   * 没有可显示的结果时，结果列表位置的说明。
   * @param {string} query 当前的搜索内容
   * @param {{heading: string, body: string} | undefined} unavailable 在线搜索没有结果的原因
   * @param {boolean} showWeb 是否显示 Web 来源的结果
   * @param {number} hidden 隐藏的网站数
   * @returns {{heading: string, body: string} | null} 说明；正在搜索时为 null
   */
  #emptyState(query, unavailable, showWeb, hidden) {
    if (this.#searching) {
      return null;
    }
    if (unavailable) {
      return unavailable;
    }
    if (!showWeb) {
      return {
        heading: "Web results are hidden",
        body: "Turn the Web source back on to show results.",
      };
    }
    if (hidden > 0) {
      return {
        heading: "No results for the selected filters",
        body: "Tick a website in Websites Filter to show its results.",
      };
    }
    return {
      heading: `No pages match “${query}”`,
      body: "Try other words.",
    };
  }

  render() {
    let query = read(CURRENT_INPUT);
    if (!query) {
      // 不存在输入值
      return <Navigate to={HOME_PATH} replace />;
    }
    if (query !== read(PREVIOUS_INPUT)) {
      // 存在新的输入值，存储新值，并搜索在线网页；结果返回后重新渲染
      write(PREVIOUS_INPUT, query);
      this.#runSearch(query);
    }
    let unavailable = this.#searching ? undefined : UNAVAILABLE[(read(WEB_SEARCH) || {}).status];
    let showWeb = read(SHOW_WEB_RESULTS) === true;
    let excluded = excludedWebsites();
    let shown = showWeb ? this.#results.filter((result) => !excluded.includes(result.domain)) : [];
    let saved = new Set(favourites().map((page) => page.link));
    let highlight = highlighter(queryTerms(query));
    let empty =
      shown.length === 0 && this.#emptyState(query, unavailable, showWeb, excluded.length);
    return (
      <div className="results-layout">
        <WebsitesFilter
          results={showWeb ? this.#results : []}
          excluded={excluded}
          onToggle={this.#toggleWebsite}
        />
        <section aria-labelledby="results-label">
          <h2 id="results-label" className="visually-hidden">
            Results
          </h2>
          <p className="status meta-mono" role="status">
            {this.#statusText(query, unavailable, showWeb, shown.length, excluded.length)}
          </p>
          {shown.length > 0 && (
            <React.Fragment>
              <ol className="results">
                {this.#orderFavouritesFirst(shown, saved).map((result, index) => (
                  <SearchResult
                    key={result.position}
                    number={index + 1}
                    result={result}
                    highlight={highlight}
                    saved={saved.has(result.link)}
                  />
                ))}
              </ol>
              {/* 注明搜索结果的来源 */}
              <p className="source-credit">
                Results from{" "}
                <a href={TAVILY_URL} target="_blank" rel="noopener noreferrer">
                  Tavily
                </a>
              </p>
            </React.Fragment>
          )}
          {empty && (
            <EmptyState icon={<FunnelIcon size={22} />} heading={empty.heading} body={empty.body} />
          )}
        </section>
      </div>
    );
  }
}

export default SearchResults;
