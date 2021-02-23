import React from "react";
import { Link } from "react-router-dom";
import "./searchResults.css";
import "bootstrap/dist/css/bootstrap.css";

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
  snippet:
    "*Round Up available at participating McDonald's restaurants in Canada. The Spicy McChicken® Challenge is back!",
},
{
  position: "2",
  title: "tieltieltileiteteiletlitllitteillietilteiltelliliet2",
  link: "https://www.mcdonalds.com/ca/en-ca/full-menu.html",
  displayed_link: "www.mcdonalds.com › en-ca › full-menu",
  snippet:
    "For delicious food, visit McDonald's today! View our wide selection of meals, snacks, drinks, and more.",
},
{
  position: "3",
  title: "McDonald's - Wikipedia",
  link: "https://en.wikipedia.org/wiki/McDonald%27s",
  displayed_link: "en.wikipedia.org › wiki › McDonald's",
  snippet:
    "McDonald's Corporation is an American fast food company, founded in 1940 as a restaurant operated by Richard and Maurice McDonald, in San Bernardino, ...",
},
{
  position: "4",
  title: "Coupons | McDonald's Canada",
  link: "https://www4.mcdonalds.ca/coupons/",
  displayed_link: "www4.mcdonalds.ca › coupons",
  snippet:
    "When you order ahead on the McDonald's app with a coupon that has fries, you're automatically collecting a Reward from the fries included in the coupon.",
},
{
  position: "5",
  title: "McDonalds Jobs in Ottawa, ON (with Salaries) - Indeed",
  link: "https://ca.indeed.com/McDonalds-jobs-in-Ottawa,-ON",
  displayed_link: "ca.indeed.com › McDonalds-jobs-in-Ottawa,-ON",
  snippet:
    "Search 53 McDonalds jobs now available in Ottawa, ON on Indeed.com, the world's largest job site.",
},
{
  position: "6",
  title:
    "McDonald's Canada - Home - Ottawa, Ontario - Menu, Prices ...",
  link: "https://www.facebook.com/McDonalds594MontrealRdOttawaON/",
  displayed_link: "www.facebook.com › ... › Sandwich Shop",
  snippet:
    "McDonald's Canada, Ottawa. 29 likes · 1 talking about this · 524 were here. Fast Food Restaurant.",
},

      ],
      searchResultError: null,
      currentInput: "",
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
  //         });
  //       },
  //       (searchResultError) => {
  //         this.setState({ searchResultError });
  //       }
  //     );
  // }

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
    //   this.retrieveSearchResults(input);
    //   return <React.Fragment />;
    // } else {
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
