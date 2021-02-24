import React from "react";
import { Link } from "react-router-dom";
import "./searchResults.css";
import "bootstrap/dist/css/bootstrap.css";

// 搜索引擎筛选
class SearchEngineFilter extends React.Component {
  // 发送显示或隐藏 Google 搜索结果请求
  firefilterGoogleResultsRequest() {
    this.props.fireGoogleResultsFilterRequest();
  }

  render() {
    return (
      <ul className="list-group list-group-flush" id="search-engine-filter">
        <li className="list-group-item" id="engine-filter-individual">
          <input
            type="checkbox"
            defaultChecked="checked"
            onChange={() => this.firefilterGoogleResultsRequest()}
          ></input>
          Google
        </li>
        <li className="list-group-item" id="engine-filter-individual">
          <input type="checkbox"></input>
          Bing
        </li>
        <li className="list-group-item" id="engine-filter-individual">
          <input type="checkbox"></input>
          Yahoo
        </li>
      </ul>
    );
  }
}

// 搜索结果网站筛选
class SearchResultsWebsitesFilter extends React.Component {
  // 发送显示或隐藏特定网页请求
  fireWebsitesFilterRequest(website) {
    this.props.fireWebsitesFilterRequest(website);
  }

  render() {
    let { searchResults } = this.props;
    let websites = [];
    searchResults.map((results) => websites.push(results.domain));
    websites = Array.from(new Set(websites));
    return (
      <ul
        className="list-group list-group-flush"
        id="search-results-websites-filter"
      >
        {websites.map((website) => (
          <li
            className="list-group-item"
            id="website-filter-individual"
            key={website}
          >
            <input
              type="checkbox"
              defaultChecked="checked"
              onChange={() => this.fireWebsitesFilterRequest(website)}
            ></input>
            {website}
          </li>
        ))}
      </ul>
    );
  }
}

// 搜索结果
class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      google_results: [],
      show_google_results: true,
      searchResultError: null,
      currentInput: "",
      exclude_websites: [],
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
            show_google_results: true,
          });
        },
        (searchResultError) => {
          this.setState({ searchResultError });
        }
      );
  }

  // 显示或隐藏 Google 搜索结果
  filterGoogleResults = () => {
    if (this.state.show_google_results === true) {
      this.setState({ show_google_results: false });
    } else {
      this.setState({ show_google_results: true });
    }
  };

  // 初始化显示或隐藏特定网页
  initializeWebsiteFilter = (website) => {
    let { exclude_websites } = this.state;
    this.setState({ exclude_websites: exclude_websites.concat(website) });
  };

  // 开始为特定网页检索搜索结果
  websiteFilter = () => {
    let { google_results, exclude_websites } = this.state;
    var filtered_results = [];
    for (let i = 0; i < google_results.length; i++) {
      var matchedwebsite = false;
      for (let j = 0; j < exclude_websites.length; j++) {
        if (google_results[i].domain === exclude_websites[j]) {
          matchedwebsite = true;
          break;
        }
      }
      if (matchedwebsite === false) {
        filtered_results = filtered_results.concat([google_results[i]]);
      }
    }
    return filtered_results;
  };

  render() {
    // 检测数据提取是否存在错误
    let { searchResultError } = this.state;
    if (searchResultError) {
      return <div>Error: {searchResultError.message}</div>;
    }
    let { history } = this.props;
    if (!history) {
      throw new Error("Data NOT received!");
    }
    let { input } = history.location;
    let { google_results } = this.state;
    if (this.state.exclude_websites !== []) {
      google_results = this.websiteFilter();
    }
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
        <React.Fragment>
          {this.state.show_google_results === true ? (
            <React.Fragment>
              {/* 显示搜索结果 */}
              <div id="search-results">
                {google_results.map((google_result) => (
                  <div
                    id="search-result-individual"
                    key={google_result.position}
                  >
                    <h6 className="card-body">
                      <Link
                        id="search-result-link"
                        target="_blank"
                        to={
                          "//" +
                          (google_result.link[4] === "s"
                            ? // https
                              google_result.link.slice(
                                8,
                                google_result.link.length
                              )
                            : // http
                              google_result.link.slice(
                                7,
                                google_result.link.length
                              ))
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
                    <hr styles="width:60%;" />
                  </div>
                ))}
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment></React.Fragment>
          )}
          {this.state.show_google_results === false ? (
            <span id="no-results">No results</span>
          ) : (
            <React.Fragment></React.Fragment>
          )}
          <React.Fragment>
            <SearchEngineFilter
              fireGoogleResultsFilterRequest={this.filterGoogleResults}
            />
          </React.Fragment>
          <React.Fragment>
            <SearchResultsWebsitesFilter
              searchResults={this.state.google_results}
              fireWebsitesFilterRequest={this.initializeWebsiteFilter}
            />
          </React.Fragment>
        </React.Fragment>
      );
    }
  }
}

class SearchResults extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Results {...this.props} />
      </React.Fragment>
    );
  }
}

export default SearchResults;
