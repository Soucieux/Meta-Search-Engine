import React from "react";
import ReactDOM from "react-dom";
import "./main.css";
import "bootstrap/dist/css/bootstrap.css";

// 搜索框，搜索按钮
class InputAndButtonAndTitle extends React.Component {
  render() {
    return (
      <div id="search-input-button-div">
        <input type="text" id="search-input" />
        <button type="submit" className="btn btn-danger" id="search-button">
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
      </div>
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
          <InputAndButtonAndTitle />
        </div>
      </React.Fragment>
    );
  }
}

// ======================================== \\

ReactDOM.render(<Search />, document.getElementById("body"));
