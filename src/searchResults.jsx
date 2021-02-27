import React from "react";
import { Link } from "react-router-dom";
import "./searchResults.css";
import "bootstrap/dist/css/bootstrap.css";

var googleColorCount = 1;

// 搜索引擎筛选
class SearchEngineFilter extends React.Component {
  // 发送显示或隐藏 Google 搜索结果请求
  firefilterGoogleResultsRequest() {
    this.props.fireGoogleResultsFilterRequest();
    this.changeButtonColor();
  }

  // 改变按钮颜色
  changeButtonColor() {
    let style = document.getElementById("engine-filter-individual").style;
    if (googleColorCount === 0) {
      style.backgroundColor = "rgb(216, 224, 210)";
      googleColorCount = 1;
    } else {
      style.backgroundColor = "rgb(255, 255, 255)";
      googleColorCount = 0;
    }
  }

  render() {
    return (
      <ul className="list-group list-group-flush" id="search-engine-filter">
        <button
          id="engine-filter-individual"
          className="button-default"
          onClick={() => this.firefilterGoogleResultsRequest()}
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
      <div className="list-group list-group-flush" id="websites-filter">
        {websites.map((website) => (
          <button
            className="list-group-item"
            id="website-filter-individual"
            key={website}
          >
            <input
              onChange={() => this.fireWebsitesFilterRequest(website)}
            ></input>
            {website}
          </button>
        ))}
      </div>
    );
  }
}

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
      show_google_results: true,
      searchResultError: null,
      currentInput: "",
      exclude_websites: [],
    };
  }

  // 提取搜索结果
  // retrieveSearchResults(input) {
  //   console.log("Start to retrieve search results\n\n");
  //   fetch(
  //     "https://api.valueserp.com/search?api_key=REDACTED&q=" +
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
  //           show_google_results: true,
  //         });
  //       },
  //       (searchResultError) => {
  //         this.setState({ searchResultError });
  //       }
  //     );
  // }

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
    if (this.state.exclude_websites !== false) {
      google_results = this.websiteFilter();
    }
    if (!input) {
      // 不存在输入值
      return <React.Fragment />;
    } else if (input !== this.state.currentInput) {
      // 存在新的输入值，存储新值并进行数据提取
      console.log("New input received and stored\n\n");
      // this.retrieveSearchResults(input);
      //   return <React.Fragment />;
      // } else {
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
