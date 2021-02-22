import React from "react";
import "./searchBar.css";
import "bootstrap/dist/css/bootstrap.css";

// 搜索框，搜索按钮
class InputAndButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      data: [],
      isSearchSubmitted: false,
      searchResultError: null,
    };
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
        this.props.history.push("/result");
        console.log("============================");
        console.log("Switch to search result page");
        console.log("============================");
      } else if (this.props.match.url === "/result") {
        // 已在搜索结果页面
        console.log("=============================");
        console.log("Already on search result page");
        console.log("=============================");
      } else {
        throw new Error(
          "Cannot find the correct url to show result.\nThis should never happen."
        );
      }
      // 提取搜索结果
      this.setState({ isSearchSubmitted: true });
      // this.componentDidMount();
    }
  }

  // 提取搜索结果
  componentDidMount() {
    if (this.state.isSearchSubmitted === true) {
      console.log("==============================");
      console.log("Data retrieval in progress...");
      console.log("==============================");
      fetch(
        "https://api.valueserp.com/search?api_key=14B8F9A0B37D47B28EA28097092BE1EB&q=" +
          this.state.input +
          "&google_domain=google.ca&location=Ottawa,Ontario,Canada&gl=ca&hl=en"
      )
        .then((res) => res.json())
        .then(
          (result) => {
            console.log(result);
            console.log(result["request_info"]);
            console.log(result["request_info"]);
            console.log(result.request_info);
            this.setState({
              data: result.organic_results,
            });
          },
          (searchResultError) => {
            this.setState({ searchResultError });
          }
        );
    } else {
      console.log("=========================================");
      console.log("Search submit button is NOT being cliked");
      console.log("=========================================");
    }
  }

  // 回车键快捷搜索
  handleKeyPress(event) {
    if (event.key === "Enter") {
      this.handleSubmitButtonOnClick(event);
    }
  }

  render() {
    const { searchResultError } = this.state;
    if (searchResultError) {
      throw new Error(searchResultError.message);
    }
    return (
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
          className="font-weight-light"
          onClick={() => this.handleResetButtonOnClick()}
        >
          X
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
    );
  }
}

// 搜索标题
class Title extends React.Component {
  render() {
    return <h1 id="search-title">Custom Search</h1>;
  }
}

// 搜索页面
class SearchBar extends React.Component {
  render() {
    return (
      <div
        id={
          "search-bar-" +
          (this.props.match.url === "/result" ? "revised" : "group")
        }
      >
        <Title />
        <InputAndButton {...this.props} />
      </div>
    );
  }
}

export default SearchBar;
