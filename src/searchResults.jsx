import React from "react";
import { Link } from "react-router-dom";
import "./searchResults.css";
import "bootstrap/dist/css/bootstrap.css";

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      google_results: [],
      searchResultError: null,
      currentInput: "",
    };
  }

  // 提取搜索结果
  retrieveSearchResults(input) {
    console.log("Start to retrieve search results\n\n");
    fetch(
      "https://api.valueserp.com/search?api_key=REDACTED&q=" +
        input +
        "&google_domain=google.ca&location=Ottawa,Ontario,Canada&gl=ca&hl=en"
    )
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          this.setState({
            google_results: result.organic_results,
            currentInput: input,
          });
        },
        (searchResultError) => {
          this.setState({ searchResultError });
        }
      );
  }

  render() {
    // 检测数据提取是否存在错误
    let { searchResultError } = this.state;
    if (searchResultError) {
      return <div>Error: {searchResultError.message}</div>;
    }
    let { input } = this.props.history.location;
    let { google_results } = this.state;
    if (!input) {
      // 不存在输入值
      return <React.Fragment />;
    } else if (input !== this.state.currentInput) {
      // 存在新的输入值，存储新值并进行数据提取
      console.log("New input received and stored\n\n");
        this.retrieveSearchResults(input);
        return <React.Fragment />;
      } else {
      // 数据提取完成，渲染页面
      console.log("Search result retrieved\n\n");
      console.log("Re-rendering search results\n\n");
      return (
        // 显示搜索结果
        <div id="search-results">
          {google_results.map((google_result) => (
            <h5 id="search-result-individual">
              <h6 className="card-body" key={google_result.position}>
                <Link
                  id="search-result-link"
                  target="_blank"
                  className="card-link"
                  to={
                    "//" +
                    (google_result.link[4] === "s"
                      ? // https
                        google_result.link.slice(8, google_result.link.length)
                      : // http
                        google_result.link.slice(7, google_result.link.length))
                  }
                >
                  {google_result.title}
                </Link>
                <div
                  id="search-result-display-link"
                  className="card-subtitle mb-2 text-muted"
                >
                  {google_result.displayed_link}
                </div>
                <div>{google_result.snippet}</div>
              </h6>
              <hr styles="width:60%;"></hr>
            </h5>
          ))}
        </div>
      );
    }
  }
}

class SearchEngineFilter extends React.Component {
  render() {
    return (
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          Dropdown button
        </button>
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a className="dropdown-item" href="#">
            Action
          </a>
          <a className="dropdown-item" href="#">
            Another action
          </a>
          <a className="dropdown-item" href="#">
            Something else here
          </a>
        </div>
      </div>
    );
  }
}

class SearchResults extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Results {...this.props} />
        <SearchEngineFilter />
      </React.Fragment>
    );
  }
}

export default SearchResults;
