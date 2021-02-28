import React from "react";
import { Link } from "react-router-dom";
import "./searchResults.css";
import "bootstrap/dist/css/bootstrap.css";

// 加载网站筛选按钮数据（每次有新输入值会重置未 false）
var isWebsiteFiltersColorLoaded = false;

// 搜索结果网站筛选
class SearchResultsWebsitesFilter extends React.Component {
  // 所有搜索结果网站
  websites = [];
  // 发送显示或隐藏特定网页请求
  fireWebsitesFilterRequest(website) {
    this.changeWebsiteFiltersColor(website[1]);
    // 来自于 Results.initializeWebsiteFilter()
    this.props.fireWebsitesFilterRequest(website[0]);
  }

  // 添加网站筛选（单独）
  loadWebsite() {
    if (isWebsiteFiltersColorLoaded === false) {
      // 来自于 Results.state.google_results
      let { searchResults } = this.props;
      searchResults.map((results) => this.websites.push(results.domain));
      this.websites = Array.from(new Set(this.websites));
      for (let i = 0; i < this.websites.length; i++) {
        // 网站URL，网站position，按钮颜色，勾选框状态
        this.websites[i] = [this.websites[i], i, "rgb(155, 163, 149)"];
      }
      isWebsiteFiltersColorLoaded = true;
    }
  }

  // 改变按钮颜色和勾选框状态
  changeWebsiteFiltersColor(position, checkboxClicked) {
    let websitesDiv = document.getElementById("websites-filter");
    let websiteFilterColorGroup = websitesDiv.getElementsByClassName(
      "list-group-item"
    );
    let websiteFilterButton = websitesDiv.getElementsByClassName("checkbox");

    if (this.websites[position][2] === "rgb(155, 163, 149)") {
      this.websites[position][2] = "rgb(255, 255, 255)";
    } else {
      this.websites[position][2] = "rgb(155, 163, 149)";
    }

    if (checkboxClicked === undefined) {
      if (websiteFilterButton[position].checked) {
        websiteFilterButton[position].checked = false;
      } else {
        websiteFilterButton[position].checked = true;
      }
    }
    websiteFilterColorGroup[position].style.backgroundColor = this.websites[
      position
    ][2];
  }

  // 勾选框触发筛选网站
  websitesFilterCheckboxClicked(website) {
    this.changeWebsiteFiltersColor(website[1], true);
    this.props.fireWebsitesFilterRequest(website[0]);
  }

  render() {
    this.loadWebsite();
    return (
      <div id="websites-filter">
        <span id="websites-filter-title">Websites Filter</span>
        {this.websites[0] === undefined ? (
          <span id="websites-filter-secondary-title">No websites</span>
        ) : (
          this.websites.map((website) => (
            <React.Fragment key={website[1]}>
              <input
                type="checkbox"
                defaultChecked="checked"
                className="checkbox"
                onClick={() => this.websitesFilterCheckboxClicked(website)}
              />
              <button
                className="list-group-item button-default"
                id="website-filter-individual"
                onClick={() => this.fireWebsitesFilterRequest(website)}
              >
                <span id="website-filter-individual-display">{website[0]}</span>
              </button>
            </React.Fragment>
          ))
        )}
      </div>
    );
  }
}

// 搜索结果
class Results extends React.Component {
  // 所搜搜索引擎结果
  all_results = [];
  constructor(props) {
    super(props);
    this.state = {
      google_results: [],
      searchResultError: null,
      currentInput: "",
      exclude_websites: [],
    };
  }

  // 提取搜索结果
  retrieveSearchResults(input) {
    console.log("Start to retrieve search results\n\n");
    fetch(
      "https://api.valueserp.com/search?api_key=14B8F9A0B37D47B28EA28097092BE1EB&q=" +
        input +
        "&google_domain=google.ca&location=Ottawa,Ontario,Canada&gl=ca&hl=en"
    )
      .then((res) => res.json())
      .then(
        (result) => {
          this.all_results = this.all_results.concat(result.organic_results);
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

  // 初始化显示或隐藏特定网页
  initializeWebsiteFilter = (websiteUrl) => {
    let { exclude_websites } = this.state;
    // 查找网站是否已经存在。若存在，则移除。若不存在，则加入。
    let duplicateUrl = false;
    for (let i = 0; i < exclude_websites.length; i++) {
      if (exclude_websites[i] === websiteUrl) {
        duplicateUrl = true;
        break;
      }
    }
    if (duplicateUrl) {
      const index = exclude_websites.indexOf(websiteUrl);
      exclude_websites.splice(index, 1);
      this.setState({ exclude_websites: exclude_websites });
    } else {
      this.setState({ exclude_websites: exclude_websites.concat(websiteUrl) });
    }
  };

  // 显示或隐藏特定网站搜索结果
  websiteFilter = (websites) => {
    let { exclude_websites } = this.state;
    var filtered_results = [];
    for (let i = 0; i < websites.length; i++) {
      var matchedwebsite = false;
      for (let j = 0; j < exclude_websites.length; j++) {
        if (websites[i].domain === exclude_websites[j]) {
          matchedwebsite = true;
          break;
        }
      }
      if (matchedwebsite === false) {
        filtered_results = filtered_results.concat([websites[i]]);
      }
    }
    return filtered_results;
  };

  render() {
    // 检测数据提取是否存在错误
    let { searchResultError } = this.state;
    if (searchResultError) {
      throw new Error("Failed to fatch!");
    }
    // 确保收到输入值
    let { history } = this.props;
    if (!history) {
      throw new Error("Data NOT received!");
    }
    // 提取输入值
    let { input, show_google_results } = history.location;
    if (!input) {
      // 不存在输入值
      return <React.Fragment />;
    } else if (input !== this.state.currentInput) {
      // 存在新的输入值，存储新值并进行数据提取
      console.log("New input identified and stored\n\n");
      isWebsiteFiltersColorLoaded = false;
      this.all_results = [];
      this.retrieveSearchResults(input);
      return <React.Fragment />;
    } else {
      let { exclude_websites } = this.state;
      let all_results_final = [];
      // 实时更新网站筛选
      if (exclude_websites[0] !== undefined) {
        all_results_final = this.websiteFilter(this.all_results);
        console.log("Search result filtered\n\n");
      } else {
        all_results_final = this.all_results;
        console.log("Search result fully displayed\n\n");
      }
      // 渲染页面
      console.log("Re-rendering search results\n\n");
      return (
        <React.Fragment>
          <React.Fragment>
            <SearchResultsWebsitesFilter
              searchResults={all_results_final}
              fireWebsitesFilterRequest={this.initializeWebsiteFilter}
            />
          </React.Fragment>
          {show_google_results === true && (
            <React.Fragment>
              {/* 显示搜索结果 */}
              <div id="search-results">
                {all_results_final.map((all_result) => (
                  <div id="search-result-individual" key={all_result.title}>
                    <h6 className="card-body">
                      <Link
                        id="search-result-link"
                        target="_blank"
                        to={
                          "//" +
                          (all_result.link[4] === "s"
                            ? // https
                              all_result.link.slice(8, all_result.link.length)
                            : // http
                              all_result.link.slice(7, all_result.link.length))
                        }
                      >
                        {all_result.title}
                      </Link>
                      <div
                        id="search-result-display-link"
                        className="card-subtitle mb-2 text-muted"
                      >
                        {all_result.displayed_link}
                      </div>
                      <div>{all_result.snippet}</div>
                    </h6>
                    <hr />
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}
          {(all_results_final[0] === undefined ||
            show_google_results === false) && (
            <span id="no-results">No results for the selected filters</span>
          )}
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
