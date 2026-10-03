import "./search.css";
import React from "react";
import SearchResults from "./searchResults";
import { APP_TITLE, AppHeader, MyPagesLink } from "./header";
import { CheckIcon, CloseIcon, InfoCircleIcon, SearchIcon, SlashCircleIcon } from "./icons";
import { RESULTS_PATH } from "./routes";
import {
  CURRENT_INPUT,
  EXCLUDED_WEBSITES,
  PREVIOUS_INPUT,
  SHOW_WEB_RESULTS,
  read,
  remove,
  write,
} from "./storage";

// 首次打开时显示 Web 来源；之后的切换存在 local storage 中，刷新后保持
if (read(SHOW_WEB_RESULTS) === null) {
  write(SHOW_WEB_RESULTS, true);
}

/**
 * 搜索框、搜索按钮和搜索框中的清除按钮。输入的内容随时保存，返回结果页或刷新时仍然显示。
 * props：isHome 为 true 时是主页白色面板中的搜索框，否则是结果页页头中的；navigate 为跳转函数。
 */
class SearchInputAndButton extends React.Component {
  /**
   * @param {{isHome: boolean, navigate: function(string): void}} props 见类的说明
   */
  constructor(props) {
    super(props);
    // 每次进入主页时搜索框为空，已保存的输入值和上一次的搜索内容都清除
    if (props.isHome) {
      remove(CURRENT_INPUT);
      remove(PREVIOUS_INPUT);
    }
    this.state = { value: props.isHome ? "" : read(CURRENT_INPUT) || "" };
  }

  /**
   * 输入时保存内容；有内容时显示清除按钮。
   * @param {React.ChangeEvent<HTMLInputElement>} event 输入事件
   */
  #handleChange = (event) => {
    write(CURRENT_INPUT, event.target.value);
    this.setState({ value: event.target.value });
  };

  /**
   * 清除按钮：清空搜索框和已保存的输入值。
   */
  #handleClear = () => {
    write(CURRENT_INPUT, "");
    this.setState({ value: "" });
  };

  /**
   * 提交搜索（点击搜索按钮，或在搜索框中按回车）：重设网站筛选，忘记上一次的搜索内容，
   * 转至结果页；结果页读取已保存的输入值并搜索，再次提交同样的内容也会重新搜索。
   * @param {React.FormEvent<HTMLFormElement>} event 表单提交事件；阻止浏览器刷新页面
   */
  #handleSubmit = (event) => {
    event.preventDefault();
    write(EXCLUDED_WEBSITES, []);
    remove(PREVIOUS_INPUT);
    this.props.navigate(RESULTS_PATH);
  };

  render() {
    let { isHome } = this.props;
    let { value } = this.state;
    return (
      <form
        role="search"
        className={isHome ? "console__search" : "search-form"}
        onSubmit={this.#handleSubmit}
      >
        {isHome && <SearchIcon size={20} />}
        <label htmlFor="search-input" className="visually-hidden">
          Search the web
        </label>
        <span className="search-field">
          <input
            type="text"
            id="search-input"
            className={isHome ? undefined : "search-input"}
            placeholder={isHome ? "Search the web" : undefined}
            autoComplete="off"
            value={value}
            onChange={this.#handleChange}
          />
          {value && (
            <button
              type="button"
              className="search-clear"
              aria-label="Clear the search box"
              onClick={this.#handleClear}
            >
              <CloseIcon size={14} />
            </button>
          )}
        </span>
        <button type="submit" className="btn-search btn-red">
          {!isHome && <SearchIcon />}
          <span>Search</span>
        </button>
      </form>
    );
  }
}

/**
 * 搜索来源按钮：Web 可以切换显示或隐藏，Google 和 Bing 尚未接入。按钮状态来自 local storage，
 * 切换后由父页面重新渲染。
 * props：isHome 为 true 时在主页面板中，带 "Sources" 标签；onToggle 在 Web 切换之后调用，
 * 父页面借此重新渲染。
 */
class SearchEngineFilter extends React.Component {
  /**
   * 显示或隐藏 Web 来源的结果。
   */
  #toggleWeb = () => {
    write(SHOW_WEB_RESULTS, !read(SHOW_WEB_RESULTS));
    this.props.onToggle();
  };

  /**
   * 尚未接入的搜索引擎按钮。用 aria-disabled 而不是 disabled，按钮仍可获得焦点，
   * 读屏软件会读出 unavailable；点击时什么也不做。页头空间有限，那里只显示虚线边框和斜杠图标，
   * "unavailable" 字样对读屏软件仍然可读，鼠标悬停时按钮的提示也会说明。
   * @param {string} name 搜索引擎名称，例如 "Google"
   * @returns {React.ReactElement} 按钮
   */
  #unavailableSource(name) {
    let noteId = name.toLowerCase() + "-note";
    return (
      <button
        type="button"
        className="source-toggle"
        aria-disabled="true"
        aria-describedby={noteId}
        title={`${name} results aren’t available yet`}
      >
        <SlashCircleIcon size={14} />
        {name}{" "}
        <span
          id={noteId}
          className={
            this.props.isHome ? "source-toggle__note" : "source-toggle__note visually-hidden"
          }
        >
          unavailable
        </span>
      </button>
    );
  }

  render() {
    let showWeb = read(SHOW_WEB_RESULTS) === true;
    let toggles = (
      <React.Fragment>
        <button
          type="button"
          className="source-toggle"
          aria-pressed={showWeb}
          onClick={this.#toggleWeb}
        >
          {showWeb && <CheckIcon size={14} />}
          Web
        </button>
        {/* Google 和 Bing 自己的搜索结果需要付费服务，尚未接入 */}
        {this.#unavailableSource("Google")}
        {this.#unavailableSource("Bing")}
      </React.Fragment>
    );
    if (this.props.isHome) {
      return (
        <div role="group" aria-labelledby="sources-label" className="console__sources">
          <span id="sources-label" className="label-mono">
            Sources
          </span>
          {toggles}
        </div>
      );
    }
    return (
      <div role="group" aria-label="Search sources" className="sources">
        {toggles}
      </div>
    );
  }
}

/**
 * 主页：背景图片（search.css）上的标题和搜索面板，右上角 My Pages，右下角图片来源。
 * props：navigate 为路由的跳转函数。
 */
class Home extends React.Component {
  /**
   * 重新渲染主页，使来源按钮显示切换后的状态。
   */
  #redraw = () => {
    this.forceUpdate();
  };

  render() {
    return (
      <main className="home">
        <MyPagesLink className="photo-chip home__mypages" />
        <div className="home__inner">
          <h1 className="home__title">{APP_TITLE}</h1>
          <div className="console">
            <SearchInputAndButton isHome navigate={this.props.navigate} />
            <SearchEngineFilter isHome onToggle={this.#redraw} />
          </div>
        </div>
        <p className="photo-chip credit">
          <InfoCircleIcon />
          Image provided by{" "}
          <a
            href="https://peapix.com/bing/34161"
            className="link-underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Bing
          </a>
        </p>
      </main>
    );
  }
}

/**
 * 结果页：页头（标题，搜索框，来源按钮，My Pages），其下为网站筛选和搜索结果。
 * props：navigate 为路由的跳转函数。
 */
class ResultsPage extends React.Component {
  /**
   * 重新渲染结果页，按切换后的来源状态显示结果和网站筛选。
   */
  #redraw = () => {
    this.forceUpdate();
  };

  render() {
    return (
      <div className="page results-page">
        <AppHeader>
          <div className="app-header__controls">
            <SearchInputAndButton isHome={false} navigate={this.props.navigate} />
            <SearchEngineFilter isHome={false} onToggle={this.#redraw} />
          </div>
        </AppHeader>
        <SearchResults />
      </div>
    );
  }
}

export { Home, ResultsPage };
