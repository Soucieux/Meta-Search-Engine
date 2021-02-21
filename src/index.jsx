import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";

// 搜索框，搜索按钮
class InputAndButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  // 实时监控和提取输入框内容并更新 state.value
  handleSearchInputChange(event) {
    this.setState({ value: event.target.value });
    let visible = document.getElementById("search-reset-button").style;
    if (event.target.value === "") {
      visible.visibility = "hidden";
    } else {
      visible.visibility = "visible";
    }
  }

  // 输入框清除按钮
  handleResetButtonOnClick() {
    this.setState({ value: "" });
    document.getElementById("search-reset-button").style.visibility = "hidden";
  }

  // 输入框提交按钮
  handleSubmitButtonOnClick() {
    if (this.state.value !== "") {
      // 调整输入框，按钮和标题至窗口正上方
      let searchStyle = document.getElementById("search-input-button-title-div")
        .style;
      searchStyle.position = "relative";
      searchStyle.transform = "translate(-50%, 0%)";

      // 校准标题位置使之与输入框和按钮齐平
      let titleStyle = document.getElementById("search-title").style;
      titleStyle.position = "relative";
      titleStyle.top = "5px";
    }
  }

  // 回车键快捷搜索
  handleKeyPress(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      this.handleSubmitButtonOnClick();
    }
  }

  render() {
    return (
      <form className="search-input-button">
        <input
          type="text"
          id="search-input"
          // 实时同步输入框内容保证在无内容时 reset button 隐藏
          value={this.state.value}
          onChange={this.handleSearchInputChange}
          // autoComplete="off"
          onKeyPress={this.handleKeyPress}
        />
        <button
          type="reset"
          id="search-reset-button"
          className="font-weight-light"
          onClick={() => this.handleResetButtonOnClick()}
        >
          X
        </button>
        <button
          type="button"
          className="btn btn-danger"
          id="search-button"
          onClick={() => this.handleSubmitButtonOnClick()}
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

// 整个搜索页面
class Search extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div id="search-input-button-title-div">
          <Title />
          <InputAndButton />
        </div>
      </React.Fragment>
    );
  }
}

// ======================================== \\

ReactDOM.render(<Search />, document.getElementById("body"));
