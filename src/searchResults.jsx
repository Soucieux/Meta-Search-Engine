import React from "react";
import { Link } from "react-router-dom";
import "./searchResults.css";
import "bootstrap/dist/css/bootstrap.css";

// 加载网站筛选按钮数据（每次有新输入值会重置未 false）
var isWebsiteFiltersColorLoaded = false;

// 搜索结果网站筛选
class SearchResultsWebsitesFilter extends React.Component {
  websites = [];
  // 发送显示或隐藏特定网页请求
  fireWebsitesFilterRequest(website) {
    this.changeWebsiteFiltersColor(website[1]);
    this.props.fireWebsitesFilterRequest(website[0]);
  }

  // 添加网站筛选（单独）
  loadWebsite() {
    if (isWebsiteFiltersColorLoaded === false) {
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
        {this.websites.map((website) => (
          <React.Fragment key={website[0]}>
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
        ))}
      </div>
    );
  }
}

var show_google_results = null;

// 搜索结果
class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      google_results: [
        {
          position: "1",
          title: "McDonald's Canada: Your Favourite Burgers, Fries & More",
          link: "http://www.mcdonalds.com/ca/en-ca.html",
          displayed_link: "www.mcdonalds.com › en-ca",
          domain: "www.mcdonalds.com",
          snippet:
            "*Round Up available at participating McDonald's restaurants in Canada. The Spicy McChicken® Challenge is back!",
        },
        {
          position: "2",
          title: "tieltieltileiteteiletlitllitteillietilteiltelliliet2",
          link: "https://www.mcdonalds.com/ca/en-ca/full-menu.html",
          displayed_link: "www.mcdonalds.com › en-ca › full-menu",
          domain: "www.mcdonalds.com",
          snippet:
            "For delicious food, visit McDonald's today! View our wide selection of meals, snacks, drinks, and more.",
        },
        {
          position: "3",
          title: "McDonald's - Wikipedia",
          link: "https://en.wikipedia.org/wiki/McDonald%27s",
          displayed_link: "en.wikipedia.org › wiki › McDonald's",
          domain: "en.wikipeida.org",
          snippet:
            "McDonald's Corporation is an American fast food company, founded in 1940 as a restaurant operated by Richard and Maurice McDonald, in San Bernardino, ...",
        },
        {
          position: "4",
          title: "Coupons | McDonald's Canada",
          link: "https://www4.mcdonalds.ca/coupons/",
          displayed_link: "www4.mcdonalds.ca › coupons",
          domain: "en.wikipeida.org",
          snippet:
            "When you order ahead on the McDonald's app with a coupon that has fries, you're automatically collecting a Reward from the fries included in the coupon.",
        },
        {
          position: "5",
          title: "McDonalds Jobs in Ottawa, ON (with Salaries) - Indeed",
          link: "https://ca.indeed.com/McDonalds-jobs-in-Ottawa,-ON",
          displayed_link: "ca.indeed.com › McDonalds-jobs-in-Ottawa,-ON",
          domain: "www.facebook.com",
          snippet:
            "Search 53 McDonalds jobs now available in Ottawa, ON on Indeed.com, the world's largest job site.",
        },
        {
          position: "6",
          title:
            "McDonald's Canada - Home - Ottawa, Ontario - Menu, Prices ...",
          link: "https://www.facebook.com/McDonalds594MontrealRdOttawaON/",
          displayed_link: "www.facebook.com › ... › Sandwich Shop",
          domain: "www.youtube.com",
          snippet:
            "McDonald's Canada, Ottawa. 29 likes · 1 talking about this · 524 were here. Fast Food Restaurant.",
        },
      ],
      searchResultError: null,
      currentInput: "123",
      exclude_websites: [],
    };
  }

  // 提取搜索结果
  // retrieveSearchResults(input) {
  //   console.log("Start to retrieve search results\n\n");
  //   fetch(
  //     "https://api.valueserp.com/search?api_key=14B8F9A0B37D47B28EA28097092BE1EB&q=" +
  //       input +
  //       "&google_domain=google.ca&location=Ottawa,Ontario,Canada&gl=ca&hl=en"
  //   )
  //     .then((res) => res.json())
  //     .then(
  //       (result) => {
  //         console.log(result);
  //         this.setState({
  //           google_results: result.organic_results,
  //           currentInput: input,
  //         });
  //       },
  //       (searchResultError) => {
  //         this.setState({ searchResultError });
  //       }
  //     );
  // }

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
    // 确保收到输入值
    let { history } = this.props;
    if (!history) {
      throw new Error("Data NOT received!");
    }
    // 提取输入值
    let { input, show_google_results } = history.location;
    if (input !== this.state.currentInput) {
      // 存在新的输入值，存储新值并进行数据提取
      console.log("New input identified and stored\n\n");
      isWebsiteFiltersColorLoaded = false;
      // this.retrieveSearchResults(input);
      return <React.Fragment />;
    } else {
      // 实时更新网站筛选
      let { google_results } = this.state;
      if (this.state.exclude_websites !== false) {
        google_results = this.websiteFilter();
        console.log("Search result filtered\n\n");
      } else {
        console.log("Search result fully displayed\n\n");
      }
      // 渲染页面
      console.log("Re-rendering search results\n\n");
      return (
        <React.Fragment>
          <React.Fragment>
            <SearchResultsWebsitesFilter
              searchResults={this.state.google_results}
              fireWebsitesFilterRequest={this.initializeWebsiteFilter}
            />
          </React.Fragment>
          {show_google_results === true && (
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
                    <hr />
                  </div>
                ))}
              </div>
            </React.Fragment>
          )}
          {(google_results[0] === undefined ||
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
