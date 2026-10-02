import React from "react";
import ls from "local-storage";
import "./searchResults.css";
import Favourite from "./favourite";
import "bootstrap/dist/css/bootstrap.css";
import { Link, Redirect } from "react-router-dom";

// 隐藏或显示搜索引擎结果
var showGoogleResultsWebsitesFilter = true;

// 储存上一次 Google 按钮状态
var previousGoogleSearchStatus = true;

var google_results = [
  {
    engine: "Google",
    position: "0",
    title: "McDonald's Canada: Your Favourite Burgers, Fries & More",
    link: "http://www.mcdonalds.com/ca/en-ca.html",
    displayed_link: "www.mcdonalds.com › en-ca",
    domain: "www.mcdonalds.com",
    snippet:
      "*Round Up available at participating McDonald's restaurants in Canada. The Spicy McChicken® Challenge is back!",
  },
  {
    engine: "Google",
    position: "1",
    title: "tieltieltileiteteiletlitllitteillietilteiltelliliet2",
    link: "https://www.mcdonalds.com/ca/en-ca/full-menu.html",
    displayed_link: "www.mcdonalds.com › en-ca › full-menu",
    domain: "www.mcdonalds.com",
    snippet:
      "For delicious food, visit McDonald's today! View our wide selection of meals, snacks, drinks, and more.",
  },
  {
    engine: "Google",
    position: "2",
    title: "McDonald's - Wikipedia",
    link: "https://en.wikipedia.org/wiki/McDonald%27s",
    displayed_link: "en.wikipedia.org › wiki › McDonald's",
    domain: "en.wikipeida.org",
    snippet:
      "McDonald's Corporation is an American fast food company, founded in 1940 as a restaurant operated by Richard and Maurice McDonald, in San Bernardino, ...",
  },
  {
    engine: "Google",
    position: "3",
    title: "Coupons | McDonald's Canada",
    link: "https://www4.mcdonalds.ca/coupons/",
    displayed_link: "www4.mcdonalds.ca › coupons",
    domain: "en.wikipeida.org",
    snippet:
      "When you order ahead on the McDonald's app with a coupon that has fries, you're automatically collecting a Reward from the fries included in the coupon.",
  },
  {
    engine: "Google",
    position: "4",
    title: "McDonalds Jobs in Ottawa, ON (with Salaries) - Indeed",
    link: "https://ca.indeed.com/McDonalds-jobs-in-Ottawa,-ON",
    displayed_link: "ca.indeed.com › McDonalds-jobs-in-Ottawa,-ON",
    domain: "www.facebook.com",
    snippet:
      "Search 53 McDonalds jobs now available in Ottawa, ON on Indeed.com, the world's largest job site.",
  },
  {
    engine: "Google",
    position: "5",
    title: "McDonald's Canada - Home - Ottawa, Ontario - Menu, Prices ...",
    link: "https://www.facebook.com/McDonalds594MontrealRdOttawaON/",
    displayed_link: "www.facebook.com › ... › Sandwich Shop",
    domain: "www.youtube.com",
    snippet:
      "McDonald's Canada, Ottawa. 29 likes · 1 talking about this · 524 were here. Fast Food Restaurant.",
  },
];

ls.set("Google results", google_results);

// 搜索结果网站筛选
class SearchResultsWebsitesFilter extends React.Component {
  // 原始搜索结果网站
  original_websites = [];
  // 当前搜索结果网站
  current_websites = [];
  // 发送显示或隐藏特定网页请求
  fireWebsitesFilterRequest(website) {
    this.switchWebsitesButtonColor(website[1]);
    // 来自于 Results.updateExcludeWebsitesList()
    this.props.fireWebsitesFilterRequest(website[0]);
  }

  // 将搜索网站 URL 转换成 array
  loadWebsitesFromResultsHelper(websites) {
    let websites_final = [];
    websites.map((results) => websites_final.push(results.domain));
    websites_final = Array.from(new Set(websites_final));
    for (let i = 0; i < websites_final.length; i++) {
      // 网站URL，网站 position，按钮颜色，勾选框状态
      websites_final[i] = [websites_final[i], i, "#f1f4f7", true];
    }
    return websites_final;
  }

  // 添加网站筛选（单独）
  loadWebsitesFromResults = () => {
    // 来自于 local storage("Google results")
    let { searchResultsFiltered, searchResultsOriginal } = this.props;
    // shwoGoogleResultsWebsitesFilter 代表每次点按 Google按钮时 重新生成新的网站筛选
    if (showGoogleResultsWebsitesFilter) {
      // 显示 Google搜索结果时，将现有网站筛选替换成原始的包含 Google的网站筛选
      this.current_websites = this.original_websites;
    } else {
      // 把网站列表转换成网站筛选
      this.current_websites = this.loadWebsitesFromResultsHelper(
        searchResultsFiltered
      );
    }
    // 此值为 true时，代表当前为首次生成网站筛选列表，此列表只会在网页最初加载时生成一次
    let loadWebsitesFilter = ls.get("load websites filter");
    //有新输入值时，保存一份原始的网站筛选用来显示或隐藏 Google所包含的网站
    if (loadWebsitesFilter) {
      // 此值不为 null时，代表网页 url是从 /favourite转至 /results 或者页面被刷新
      let current_websites_retrieved = ls.get("current websites");
      let original_websites_retrieved = ls.get("original websites");
      if (original_websites_retrieved !== null) {
        this.original_websites = original_websites_retrieved;
        this.current_websites = current_websites_retrieved;
      } else {
        // 把网站列表转换成网站筛选
        if (showGoogleResultsWebsitesFilter) {
          this.current_websites = this.loadWebsitesFromResultsHelper(
            searchResultsFiltered
          );
        }
        this.original_websites = this.loadWebsitesFromResultsHelper(
          searchResultsOriginal
        );
        ls.set("original websites", this.original_websites);
      }
    }
    ls.set("current websites", this.current_websites);
    ls.set("load websites filter", false);
  };

  // 改变按钮颜色和勾选框状态
  switchWebsitesButtonColor = (position, checkboxClicked) => {
    let websitesDiv = document.getElementById("websites-filter");
    let websitesFilterButtons = websitesDiv.getElementsByClassName(
      "list-group-item"
    );
    let websiteFilterCheckboxes = websitesDiv.getElementsByClassName(
      "checkbox"
    );

    // 代表此网站相关的搜索结果已显示
    let displayResult = "#f1f4f7";
    // 代表此网站相关的搜索结果未显示
    let notDisplayResult = "rgb(255, 255, 255)";

    if (this.current_websites[position][2] === displayResult) {
      this.current_websites[position][2] = notDisplayResult;
    } else {
      this.current_websites[position][2] = displayResult;
    }

    if (this.current_websites[position][3]) {
      this.current_websites[position][3] = false;
    } else {
      this.current_websites[position][3] = true;
    }

    if (checkboxClicked === undefined) {
      if (websiteFilterCheckboxes[position].checked) {
        websiteFilterCheckboxes[position].checked = false;
      } else {
        websiteFilterCheckboxes[position].checked = true;
      }
    }
    websitesFilterButtons[
      position
    ].style.backgroundColor = this.current_websites[position][2];
    this.original_websites = this.current_websites;
    ls.set("current websites", this.current_websites);
    ls.set("original websites", this.original_websites);
  };

  // 勾选框触发筛选网站
  websitesFilterCheckboxClicked(website) {
    this.switchWebsitesButtonColor(website[1], true);
    this.props.fireWebsitesFilterRequest(website[0]);
  }

  render() {
    this.loadWebsitesFromResults();
    console.log("Re-rendering websites filter\n\n");
    return (
      <div id="websites-filter">
        <span id="websites-filter-title">Websites Filter</span>
        {this.current_websites[0] === undefined ? (
          <span id="websites-filter-secondary-title">No websites</span>
        ) : (
          this.current_websites.map((website) => (
            <React.Fragment key={website[1]}>
              <input
                type="checkbox"
                className="checkbox"
                checked={website[3]}
                onChange={() => this.websitesFilterCheckboxClicked(website)}
              />
              <button
                className="list-group-item button-default"
                id="website-filter-individual"
                onClick={() => this.fireWebsitesFilterRequest(website)}
                style={{ background: website[2] }}
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

/**
 * 一条搜索结果及其收藏按钮。是否已收藏来自已收藏网页，已收藏的结果带有背景色。
 * 点击收藏按钮时只重新渲染这条结果，不会重新渲染整个结果页。
 */
class SearchResult extends React.Component {
  /**
   * @param {{result: Object, isFavourite: function(Object): boolean, onToggle: function(Object): void}} props
   *   result 为要显示的搜索结果；isFavourite 检查它是否已收藏；onToggle 收藏或取消收藏它
   */
  constructor(props) {
    super(props);
    this.state = { saved: props.isFavourite(props.result) };
    this.handleClick = this.handleClick.bind(this);
  }

  /**
   * 收藏或取消收藏这条搜索结果，并按已收藏网页更新按钮和背景色。
   */
  handleClick() {
    this.props.onToggle(this.props.result);
    this.setState({ saved: this.props.isFavourite(this.props.result) });
  }

  render() {
    let result_individual = this.props.result;
    return (
      <div
        id="search-result-individual"
        className={this.state.saved ? "saved-search-result" : undefined}
      >
        <h6 className="card-body">
          <Link
            id="search-result-link"
            target="_blank"
            to={
              "//" +
              (result_individual.link[4] === "s"
                ? // https
                  result_individual.link.slice(8, result_individual.link.length)
                : // http
                  result_individual.link.slice(7, result_individual.link.length))
            }
          >
            {result_individual.title}
          </Link>
          <div
            id="search-result-display-link"
            className="card-subtitle mb-2 text-muted"
          >
            {result_individual.displayed_link}
          </div>
          <div>{result_individual.snippet}</div>
        </h6>
        <button
          className="add-favourite-webpages"
          style={this.state.saved ? { backgroundColor: "#dc3545" } : undefined}
          onClick={this.handleClick}
        >
          {this.state.saved ? "Remove" : "Favourite"}
        </button>
        <hr />
      </div>
    );
  }
}

// 搜索结果
class Results extends React.Component {
  // 筛选前的所搜搜索结果，保存为初始结果
  all_results_original = [];
  // 筛选后的所有搜索结果
  all_results_filtered = [];

  constructor(props) {
    super(props);
    this.state = { searchResultsError: null };
    this.all_results_original = this.all_results_original.concat(
      ls.get("Google results")
    );
    this.all_results_filtered = this.all_results_original;
  }

  // 增加搜索引擎标签
  addGoogleTag(resultsWithoutTag) {
    for (var i = 0; i < resultsWithoutTag.length; i++) {
      resultsWithoutTag[i]["engine"] = "Google";
      resultsWithoutTag[i]["position"] = i;
    }
    return resultsWithoutTag;
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
  //         let resultsWithTag = this.addGoogleTag(result.organic_results);
  //         this.all_results_original = this.all_results_original.concat(
  //           resultsWithTag
  //         );
  //         this.all_results_filtered = this.all_results_original;
  //         ls.set("Google results", resultsWithTag);
  //         this.props.history.push("/results");
  //       },
  //       (searchResultsError) => {
  //         this.setState({ searchResultsError });
  //       }
  //     );
  // }

  // 更新 exclude_websites 列表
  updateExcludeWebsitesList = (websiteUrl) => {
    let exclude_websites = ls.get("exclude websites");
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
      ls.set("exclude websites", exclude_websites);
    } else {
      let updated_exclude_websites = exclude_websites.concat(websiteUrl);
      ls.set("exclude websites", updated_exclude_websites);
    }
    this.props.history.push("/results");
  };

  // 显示或隐藏特定网站搜索结果
  // 此操作不会更改 all_results_original 和 all_results_filtered 的值
  filterResultsByWesbites = () => {
    let exclude_websites = ls.get("exclude websites");
    var filtered_websites_results = [];
    for (let i = 0; i < this.all_results_original.length; i++) {
      var matchedwebsite = false;
      for (let j = 0; j < exclude_websites.length; j++) {
        if (this.all_results_original[i].domain === exclude_websites[j]) {
          matchedwebsite = true;
          break;
        }
      }
      if (matchedwebsite === false) {
        filtered_websites_results = filtered_websites_results.concat([
          this.all_results_original[i],
        ]);
      }
    }
    return filtered_websites_results;
  };

  // 显示或隐藏特定搜索引擎搜索结果
  // 此操作会不会更改 all_results_original 的值，但会更改 all_results_filtered 的值
  filterResultsBySearchEngine(results, google) {
    let show_results = [];
    if (google === false) {
      for (let i = 0; i < results.length; i++) {
        if (results[i]["engine"] !== "Google") {
          show_results.push(results[i]);
        }
      }
      previousGoogleSearchStatus = false;
    } else if (google === true) {
      for (let i = 0; i < this.all_results_original.length; i++) {
        if (this.all_results_original[i]["engine"] === "Google") {
          show_results.push(this.all_results_original[i]);
        }
      }
      previousGoogleSearchStatus = true;
    }
    return show_results;
  }

  // 获取网站筛选后的搜索结果
  retrieveResultsByWebsites = () => {
    let exclude_websites = ls.get("exclude websites");
    if (exclude_websites[0] !== undefined) {
      console.log("Search results filtered based on websites\n\n");
    } else {
      console.log("Search results fully displayed without websites filter\n\n");
    }
    return this.filterResultsByWesbites();
  };

  // 提取搜索结果错误
  retrieveResultsError = () => {
    let { searchResultsError } = this.state;
    if (searchResultsError) {
      throw new Error("Failed to fatch!");
    }
  };

  // 显示或隐藏 Google搜索结果
  filterGoogleResults = () => {
    let google_status = ls.get("show Google results");
    if (
      (previousGoogleSearchStatus === true && google_status === false) ||
      (previousGoogleSearchStatus === false && google_status === true)
    ) {
      this.all_results_filtered = this.filterResultsBySearchEngine(
        this.all_results_filtered,
        google_status
      );
      if (showGoogleResultsWebsitesFilter) {
        showGoogleResultsWebsitesFilter = false;
      } else {
        showGoogleResultsWebsitesFilter = true;
      }
    }
  };

  /**
   * 更新已收藏网页：加入一条搜索结果，或按链接移除它。
   * @param {Object} resultToBeChecked 要加入或移除的搜索结果
   * @param {boolean} add_result 为 true 时加入，为 false 时移除
   */
  updateFavouriteWebsites(resultToBeChecked, add_result) {
    let updated_favourite = [];
    let current_favourite = ls.get("favourite websites");
    if (add_result) {
      if (current_favourite === null) {
        updated_favourite = updated_favourite.concat(resultToBeChecked);
      } else {
        current_favourite = current_favourite.concat(resultToBeChecked);
        updated_favourite = current_favourite;
      }
    } else {
      for (let i = 0; i < current_favourite.length; i++) {
        if (current_favourite[i]["link"] !== resultToBeChecked["link"]) {
          updated_favourite = updated_favourite.concat(current_favourite[i]);
        }
      }
    }
    ls.set("favourite websites", updated_favourite);
  }

  /**
   * 检查一条搜索结果是否已收藏，以链接作为网页的标识。
   * @param {Object} result 搜索结果
   * @returns {boolean} 已收藏时为 true
   */
  isFavouriteWebsite(result) {
    let current_favourite = ls.get("favourite websites");
    return (
      current_favourite !== null &&
      current_favourite.some((favourite) => favourite.link === result.link)
    );
  }

  /**
   * 收藏或取消收藏一条搜索结果。是否已收藏由已收藏网页决定，
   * 因此返回结果页或刷新后按钮仍然正确，也不会重复收藏同一网页。
   * @param {Object} resultToBeChanged 被点击按钮所属的搜索结果
   */
  changeFavouriteButtonStatus = (resultToBeChanged) => {
    if (this.isFavouriteWebsite(resultToBeChanged)) {
      this.updateFavouriteWebsites(resultToBeChanged, false);
      console.log("Favourite website removed\n\n");
    } else {
      this.updateFavouriteWebsites(resultToBeChanged, true);
      console.log("Favourite website added\n\n");
    }
    console.log("Data in favourite\n");
    console.log(ls.get("favourite websites"));
    console.log("");
  };

  /**
   * 把已收藏的搜索结果排在前面，两部分各自保持原来的顺序。
   * 在结果页渲染时排序，因此收藏或取消收藏后，结果页下次渲染时才移动这条结果。
   * @param {Object[]} results 要显示的搜索结果
   * @returns {Object[]} 排序后的新数组，传入的数组不变
   */
  orderFavouritesFirst(results) {
    return results
      .filter((result) => this.isFavouriteWebsite(result))
      .concat(results.filter((result) => !this.isFavouriteWebsite(result)));
  }

  render() {
    // 检测数据提取是否存在错误
    this.retrieveResultsError();
    // 显示或隐藏 Google搜索结果
    this.filterGoogleResults();
    // 提取输入值
    let currentInput = ls.get("current input");
    if (currentInput && currentInput !== ls.get("previous input")) {
      // 存在新的输入值，存储新值；实时搜索未启用，载入内置的示例搜索结果
      console.log("New input identified and stored\n\n");
      ls.set("load websites filter", true);
      ls.set("previous input", currentInput);
      this.all_results_original = [].concat(ls.get("Google results"));
      this.all_results_filtered = this.all_results_original;
      // this.retrieveSearchResults(currentInput);
    }
    if (!currentInput) {
      // 不存在输入值
      console.log("No input. Switch back to main page\n\n");
      return <Redirect from="/results" to="/"></Redirect>;
    } else {
      // 实时更新网站筛选
      if (ls.get("show Google results")) {
        this.all_results_filtered = this.retrieveResultsByWebsites();
      }
      // log
      console.log("Data in original\n");
      console.log(this.all_results_original);
      console.log("");
      console.log("Data in filtered\n");
      console.log(this.all_results_filtered);
      console.log("");
      console.log("Data in favourite\n");
      console.log(ls.get("favourite websites"));
      console.log("");
      console.log("Re-rendering search results based on filtered\n\n");
      // 渲染页面
      return (
        <React.Fragment>
          <React.Fragment>
            <SearchResultsWebsitesFilter
              searchResultsFiltered={this.all_results_filtered}
              searchResultsOriginal={this.all_results_original}
              fireWebsitesFilterRequest={this.updateExcludeWebsitesList}
            />
          </React.Fragment>
          {this.all_results_filtered[0] !== undefined && (
            <React.Fragment>
              {/* 显示搜索结果 */}
              <div id="search-results">
                {this.orderFavouritesFirst(this.all_results_filtered).map(
                  (result_individual) => (
                    <SearchResult
                      key={result_individual.position}
                      result={result_individual}
                      isFavourite={this.isFavouriteWebsite}
                      onToggle={this.changeFavouriteButtonStatus}
                    />
                  )
                )}
              </div>
              <Favourite />
            </React.Fragment>
          )}
          {this.all_results_filtered[0] === undefined && (
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
