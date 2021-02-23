import React from "react";
import SearchRestuls from "./searchResults";
import "./searchBar.css";
import "bootstrap/dist/css/bootstrap.css";

// 搜索框，搜索按钮，搜索清除按钮
class SearchInputAndButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input: "" };
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleSubmitButtonOnClick = this.handleSubmitButtonOnClick.bind(this);
  }

  // 实时监控和提取输入框内容并更新 state.input
  handleSearchInputChange(event) {
    this.setState({ input: event.target.value });
    let visible = document.getElementById("search-button-reset").style;
    if (event.target.value === "") {
      visible.visibility = "hidden";
    } else {
      visible.visibility = "visible";
    }
  }

  // 输入框清除按钮
  handleResetButtonOnClick() {
    this.setState({ input: "" });
    document.getElementById("search-button-reset").style.visibility = "hidden";
  }

  // 输入框提交按钮
  handleSubmitButtonOnClick(event) {
    // 禁止按钮默认自动刷新整个页面
    event.preventDefault();
    if (this.state.input !== "") {
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

      console.log("Passing input\n\n");

      // 重新渲染并传递输入框内容
      this.componentDidMount(true);
    }
  }

  componentDidMount(isSubmitButtonClicked) {
    if (isSubmitButtonClicked) {
      // 传递输入框内容至 this.props.location
      this.props.history.push({ input: this.state.input });
      console.log("Input passed\n\n");
    } else {
      console.log("Search button NOT cliked. No results retrieved.\n\n");
    }
  }

  // 回车键快捷搜索
  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.handleSubmitButtonOnClick(event);
    }
  }

  render() {
    const { searchResultError, organic_results } = this.state;
    if (searchResultError) {
      throw new Error(searchResultError.message);
    }
    return (
      <React.Fragment>
        <form className="search-input-button-submit-group">
          <input
            type="text"
            id="search-input"
            // 实时同步输入框内容确保在无内容时 reset button 隐藏
            value={this.state.input}
            onChange={this.handleSearchInputChange}
            onKeyPress={this.handleKeyPress}
          />
          <button
            type="reset"
            id="search-button-reset"
            className="close"
            aria-label="Close"
            onClick={() => this.handleResetButtonOnClick()}
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
    return <h1 id="search-title">Custom Search</h1>;
  }
}

// 搜索页面
class SearchBar extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div
          id={
            "search-bar-" +
            (this.props.match.url === "/results" ? "revised" : "group")
          }
        >
          <SearchTitle />
          <SearchInputAndButton {...this.props} />
        </div>
        <SearchRestuls {...this.props} />
      </React.Fragment>
    );
  }
}

export default SearchBar;
