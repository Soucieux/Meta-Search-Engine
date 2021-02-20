import React from "react";
import ReactDOM from "react-dom";
import "./main.css";
import "bootstrap/dist/css/bootstrap.css";

// 搜索框，搜索按钮
class InputAndButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
  }

  // 实时监控和提取输入框内容并更新state.value
  handleSearchInputChange(event) {
    this.setState({ value: event.target.value });
    if (event.target.value === "") {
      document.getElementById("search-reset-button").style.visibility =
        "hidden";
    } else {
      document.getElementById("search-reset-button").style.visibility =
        "visible";
    }
  }

  // 输入框清除按钮
  handleResetButtonOnClick() {
    this.setState({ value: "" });
    document.getElementById("search-reset-button").style.visibility = "hidden";
  }

  render() {
    return (
      <form id="search-input-button">
        <input
          type="text"
          id="search-input"
          value={this.state.value}
          onChange={this.handleSearchInputChange}
        />
        <button
          type="reset"
          id="search-reset-button"
          className="font-weight-light"
          onClick={() => this.handleResetButtonOnClick()}
        >
          X
        </button>
        <button type="button" className="btn btn-danger" id="search-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-search"
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
