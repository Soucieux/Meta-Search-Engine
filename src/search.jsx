import "./search.css";
import React from "react";
import ls from "local-storage";
import SearchResults from "./searchResults";
import { Link } from "react-router";
import {
  CheckIcon,
  CloseIcon,
  InfoCircleIcon,
  PersonCircleIcon,
  SearchIcon,
  SlashCircleIcon,
} from "./icons";

// 初始化 local storage
ls.set("show Google results", true);
ls.set("load websites filter", true);
ls.set("new input received", false);

// 搜索框，搜索按钮，搜索清除按钮
class SearchInputAndButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmitButtonOnClick = this.handleSubmitButtonOnClick.bind(this);
    this.handleResetButtonOnClick = this.handleResetButtonOnClick.bind(this);
  }

  // 实时监控和提取输入框内容并储存至 local storage
  handleSearchInputChange(event) {
    ls.set("current input", event.target.value);
    let visible = document.getElementById("search-button-reset").style;
    if (event.target.value === "") {
      visible.visibility = "hidden";
    } else {
      visible.visibility = "visible";
    }
  }

  /**
   * 输入框清除按钮：清空输入框和已保存的输入值。
   * 阻止表单重置，因为重置会把输入框恢复为初始值，也就是上一次搜索的内容。
   * @param {Event} event 清除按钮的点击事件
   */
  handleResetButtonOnClick(event) {
    event.preventDefault();
    document.getElementById("search-input").value = "";
    ls.set("current input", "");
    document.getElementById("search-button-reset").style.visibility = "hidden";
  }

  // 输入框提交按钮
  handleSubmitButtonOnClick(event) {
    // 禁止按钮默认自动刷新整个页面
    event.preventDefault();
    if (this.props.location === undefined) {
      // 检测 this.props 是否有值
      throw new Error("this.props.location is undefined!");
    } else if (this.props.location.pathname === "/") {
      // 转至搜索结果页面
      this.props.navigate("/results");
      console.log("Switch to search results page\n\n");
    } else if (this.props.location.pathname === "/results") {
      // 已在搜索结果页面
      this.props.navigate("/results");
      console.log("Already on search results page\n\n");
    } else {
      throw new Error(
        "Cannot find the correct url to show results.\nThis should never happen."
      );
    }
    ls.set("new input received", true);
    console.log("Input is: " + ls.get("current input") + " \n\n");
  }

  // 回车键快捷搜索
  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.handleSubmitButtonOnClick(event);
    }
  }

  render() {
    let url = this.props.location.pathname;
    // 每次进入 main page 时，清除已保存的输入值
    if (url === "/") {
      ls.remove("current input");
      ls.remove("previous input");
    }
    // 主页的搜索框在白色面板（console）中，结果页的搜索框在页头
    let isHome = url === "/";
    return (
      <form role="search" className={isHome ? "console__search" : "search-form"}>
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
            // 确保返回或刷新页面时，输入值仍显示
            defaultValue={url === "/results" ? ls.get("current input") : ""}
            onChange={this.handleSearchInputChange}
            onKeyPress={this.handleKeyPress}
          />
          <button
            type="reset"
            id="search-button-reset"
            aria-label="Clear the search box"
            onClick={this.handleResetButtonOnClick}
          >
            <CloseIcon size={14} />
          </button>
        </span>
        <button
          type="submit"
          className="btn-search"
          id="search-button-submit"
          onClick={this.handleSubmitButtonOnClick}
        >
          {!isHome && <SearchIcon />}
          <span>Search</span>
        </button>
      </form>
    );
  }
}

// 搜索引擎筛选
class SearchEngineFilter extends React.Component {
  // 发送显示或隐藏 Google 搜索结果请求
  prepareFilterGoogleSearchResults() {
    if (ls.get("show Google results") === true) {
      ls.set("show Google results", false);
      console.log("Google saerch results disabled\n\n");
    } else {
      ls.set("show Google results", true);
      console.log("Google saerch results enabled\n\n");
    }
    if (this.props.location.pathname === "/results") {
      // 重新渲染结果页，按新的状态筛选搜索结果
      this.props.navigate("/results");
    } else {
      // 主页没有搜索结果，只更新按钮。跳转到结果页时，没有搜索内容会立即返回主页，使页面闪烁
      this.forceUpdate();
    }
  }

  render() {
    // 按钮状态来自 local storage，切换后重新渲染时随之更新
    let showGoogle = ls.get("show Google results") === true;
    let toggles = (
      <React.Fragment>
        <button
          type="button"
          className="source-toggle"
          aria-pressed={showGoogle}
          onClick={() => this.prepareFilterGoogleSearchResults()}
        >
          {showGoogle && <CheckIcon size={14} />}
          Google
        </button>
        {/* Bing 尚未接入：用 aria-disabled 而不是 disabled，按钮仍可获得焦点，读屏软件会读出 unavailable */}
        <button
          type="button"
          className="source-toggle"
          aria-disabled="true"
          aria-describedby="bing-note"
          title="Bing results aren’t available yet"
        >
          <SlashCircleIcon size={14} />
          Bing{" "}
          <span id="bing-note" className="source-toggle__note">
            unavailable
          </span>
        </button>
      </React.Fragment>
    );
    if (this.props.location.pathname === "/") {
      return (
        <div
          role="group"
          aria-labelledby="sources-label"
          className="console__sources"
        >
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

// 搜索页面
class Search extends React.Component {
  render() {
    if (ls.get("new input received")) {
      ls.set("current websites", null);
      ls.set("original websites", null);
      ls.set("exclude websites", []);
      ls.set("new input received", false);
    }
    if (this.props.location.pathname === "/results") {
      // 结果页：页头（标题，搜索框，搜索引擎，My Pages），其下为网站筛选和搜索结果
      return (
        <div className="results-page">
          <header className="app-header">
            <div className="app-header__inner">
              <Link to="/" className="app-header__title">
                <img src="/logo.png" alt="" className="app-header__logo" />
                Custom Search
              </Link>
              <div className="app-header__controls">
                <SearchInputAndButton {...this.props} />
                <SearchEngineFilter {...this.props} />
              </div>
              <Link to="/favourite" className="mypages-link">
                <PersonCircleIcon size={18} />
                My Pages
              </Link>
            </div>
          </header>
          <SearchResults {...this.props} />
        </div>
      );
    }
    // 主页：背景图片（search.css），标题和搜索面板，右上角 My Pages，右下角图片来源
    return (
      <main className="home">
        <Link to="/favourite" className="photo-chip home__mypages">
          <PersonCircleIcon size={18} />
          My Pages
        </Link>
        <div className="home__inner">
          <h1 className="home__title">Custom Search</h1>
          <div className="console">
            <SearchInputAndButton {...this.props} />
            <SearchEngineFilter {...this.props} />
          </div>
        </div>
        <p className="photo-chip credit">
          <InfoCircleIcon />
          Image provided by{" "}
          <a
            href="https://peapix.com/bing/34161"
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

export default Search;
