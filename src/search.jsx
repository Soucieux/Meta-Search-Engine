import "./search.css";
import React from "react";
import ls from "local-storage";
import SearchResults from "./searchResults";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";

var show_google_results = true;

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
    ls.set("input", event.target.value);
    let visible = document.getElementById("search-button-reset").style;
    if (event.target.value === "") {
      visible.visibility = "hidden";
    } else {
      visible.visibility = "visible";
    }
  }

  // 输入框清除按钮
  handleResetButtonOnClick() {
    ls.set("input", "");
    document.getElementById("search-button-reset").style.visibility = "hidden";
  }

  // 输入框提交按钮
  handleSubmitButtonOnClick(event) {
    // 禁止按钮默认自动刷新整个页面
    event.preventDefault();
    if (this.props.match == undefined) {
      // 检测 this.props 是否有值
      throw new Error("this.props.match is undefined!");
    } else if (this.props.match.url === "/") {
      // 转至搜索结果页面
      this.props.history.push("/results");
      console.log("Switch to search results page\n\n");
    } else if (this.props.match.url === "/results") {
      // 已在搜索结果页面
      console.log("Already on search results page\n\n");
    } else {
      throw new Error(
        "Cannot find the correct url to show results.\nThis should never happen."
      );
    }
    // 传递输入框内容和搜索引擎设置
    this.componentDidMount();
  }

  // 传递输入框内容和搜索引擎设置
  componentDidMount() {
    // 传递输入框内容至 this.props.location
    this.props.history.push({
      show_google_results: show_google_results,
    });
    console.log("Input is: " + ls.get("input") + " \n\n");
  }

  // 回车键快捷搜索
  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.handleSubmitButtonOnClick(event);
    }
  }

  render() {
    return (
      <React.Fragment>
        <form className="search-input-button-submit-group">
          <input
            type="text"
            id="search-input"
            autoComplete="off"
            onChange={this.handleSearchInputChange}
            onKeyPress={this.handleKeyPress}
          />
          <button
            type="reset"
            id="search-button-reset"
            className="close"
            aria-label="Close"
            onClick={this.handleResetButtonOnClick}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <button
            type="submit"
            className="btn btn-danger"
            id="search-button-submit"
            onClick={this.handleSubmitButtonOnClick}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
          </button>
        </form>
      </React.Fragment>
    );
  }
}

// 搜索标题
class SearchTitle extends React.Component {
  render() {
    return (
      <div id="search-title-group">
        <h1 id="search-title">Custom</h1>
        <h1 id="search-title">Search</h1>
      </div>
    );
  }
}

// 搜索引擎筛选
class SearchEngineFilter extends React.Component {
  // 发送显示或隐藏 Google 搜索结果请求
  prepareFilterGoogleSearchResults() {
    if (show_google_results === true) {
      show_google_results = false;
      this.props.history.push({
        show_google_results: false,
      });
      console.log("Google saerch results disabled\n\n");
    } else {
      this.props.history.push({
        show_google_results: true,
      });
      show_google_results = true;
      console.log("Google saerch results enabled\n\n");
    }
    this.changeButtonColor();
  }
  // 原始图标颜色
  googleIconColor = "rgb(155, 163, 149)";

  // 改变按钮颜色
  changeButtonColor() {
    let { style } = document.getElementById("engine-filter-individual");
    if (this.googleIconColor === "rgb(155, 163, 149)") {
      this.googleIconColor = "rgb(255, 255, 255)";
    } else {
      this.googleIconColor = "rgb(155, 163, 149)";
    }
    style.backgroundColor = this.googleIconColor;
  }

  render() {
    return (
      <div>
        <div
          className="list-group list-group-flush"
          id="search-engine-filter-group"
        >
          <button
            id="engine-filter-individual"
            className="button-default"
            onClick={() => this.prepareFilterGoogleSearchResults()}
          >
            <input
              type="image"
              alt="Google"
              src="googleIcon.ico"
              id="google-icon"
            />
          </button>
          <button id="engine-filter-individual" className="button-default">
            <input type="image" alt="Bing" src="bingIcon.ico" id="bing-icon" />
          </button>
        </div>
        {this.props.match.url === "/results" && (
          <SearchResults {...this.props} />
        )}
      </div>
    );
  }
}

// 搜索页面
class Search extends React.Component {
  render() {
    return (
      <main>
        {this.props.match.url !== "/results" && (
          <div>
            <img src="main.jpg" id="main-image" />
            <div id="image-copyright-button">
              <Link target="_blank" to="//peapix.com/bing/34161">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  fill="white"
                  className="bi bi-info-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                  <path d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
              </Link>
            </div>
            <div id="image-copyright-text">Image provided by Bing</div>
          </div>
        )}
        <div>
          <div
            id={
              "search-bar-" +
              (this.props.match.url === "/results" ? "revised" : "group")
            }
          >
            <SearchEngineFilter {...this.props} />
            <SearchInputAndButton {...this.props} />
            <SearchTitle />
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="50"
            height="50"
            fill="currentColor"
            className="bi bi-person-circle button-default"
            id={
              "favourite-pages-icon-" +
              (this.props.match.url === "/" ? "before" : "after")
            }
            viewBox="0 0 16 16"
            onClick={() => this.props.history.push("/favourite")}
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path
              fillRule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
            />
          </svg>
        </div>
      </main>
    );
  }
}

export default Search;
