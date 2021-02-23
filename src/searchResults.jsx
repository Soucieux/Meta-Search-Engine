import React from "react";
import { Link, Redirect } from "react-router-dom";
import "./searchResults.css";

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      organic_results: [
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

  //   提取搜索结果
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
  //           organic_results: result.organic_results,
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
    let { organic_results } = this.state;
    if (!input) {
      // 不存在输入值
      return <React.Fragment />;
    } else if (input !== this.state.currentInput) {
      // 存在新的输入值，存储新值并进行数据提取
      console.log("New input received and stored\n\n");
      //  this.retrieveSearchResults(input);
      // return <React.Fragment />;
      //    } else {
      // 数据提取完成，渲染页面
      console.log("Search result retrieved\n\n");
      console.log("Re-rendering search results\n\n");
      return (
        // 显示搜索结果
        <div id="search-results">
          {organic_results.map((organic_result) => (
            <ul key={organic_result.position}>
              <Link
                target="_blank"
                to={
                  "//" +
                  (organic_result.link[4] === "s"
                    // https
                    ? organic_result.link.slice(8, organic_result.link.length)
                    // http
                    : organic_result.link.slice(7, organic_result.link.length))
                }
              >
                {organic_result.title}
              </Link>
              <div>{organic_result.displayed_link}</div>
              <div>{organic_result.snippet}</div>
            </ul>
          ))}
        </div>
      );
    }
  }
}

class SearchResults extends React.Component {
  render() {
    return <Results {...this.props} />;
  }
}

export default SearchResults;
