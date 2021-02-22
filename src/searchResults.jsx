import React from "react";

class Results extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      organic_results: [
        {
          title: "McDonald's Canada: Your Favourite Burgers, Fries & More",
          link: "https://www.mcdonalds.com/ca/en-ca.html",
          displayed_link: "www.mcdonalds.com › en-ca",
          snippet:
            "*Round Up available at participating McDonald's restaurants in Canada. The Spicy McChicken® Challenge is back!",
        },
        {
          title: "tieltieltileiteteiletlitllitteillietilteiltelliliet2",
          link: "https://www.mcdonalds.com/ca/en-ca/full-menu.html",
          displayed_link: "www.mcdonalds.com › en-ca › full-menu",
          snippet:
            "For delicious food, visit McDonald's today! View our wide selection of meals, snacks, drinks, and more.",
        },
        {
          title: "McDonald's - Wikipedia",
          link: "https://en.wikipedia.org/wiki/McDonald%27s",
          displayed_link: "en.wikipedia.org › wiki › McDonald's",
          snippet:
            "McDonald's Corporation is an American fast food company, founded in 1940 as a restaurant operated by Richard and Maurice McDonald, in San Bernardino, ...",
        },
        {
          title: "Coupons | McDonald's Canada",
          link: "https://www4.mcdonalds.ca/coupons/",
          displayed_link: "www4.mcdonalds.ca › coupons",
          snippet:
            "When you order ahead on the McDonald's app with a coupon that has fries, you're automatically collecting a Reward from the fries included in the coupon.",
        },
        {
          title: "McDonalds Jobs in Ottawa, ON (with Salaries) - Indeed",
          link: "https://ca.indeed.com/McDonalds-jobs-in-Ottawa,-ON",
          displayed_link: "ca.indeed.com › McDonalds-jobs-in-Ottawa,-ON",
          snippet:
            "Search 53 McDonalds jobs now available in Ottawa, ON on Indeed.com, the world's largest job site.",
        },
        {
          title:
            "McDonald's Canada - Home - Ottawa, Ontario - Menu, Prices ...",
          link: "https://www.facebook.com/McDonalds594MontrealRdOttawaON/",
          displayed_link: "www.facebook.com › ... › Sandwich Shop",
          snippet:
            "McDonald's Canada, Ottawa. 29 likes · 1 talking about this · 524 were here. Fast Food Restaurant.",
        },
      ],
      searchResultError: null,
    };
  }

  //   提取搜索结果
  //   componentDidMount(isSubmitButtonClicked) {
  //     console.log("Results retrieval in progress...\n\n");
  //     fetch(
  //       "https://api.valueserp.com/search?api_key=REDACTED&q=" +
  //         this.state.input +
  //         "&google_domain=google.ca&location=Ottawa,Ontario,Canada&gl=ca&hl=en"
  //     )
  //       .then((res) => res.json())
  //       .then(
  //         (result) => {
  //           console.log(result);
  //           this.setState({
  //             organic_results: result.organic_results,
  //           });
  //         },
  //         (searchResultError) => {
  //           this.setState({ searchResultError });
  //         }
  //       );
  //   }

  render() {
    console.log("Data received successfully\n\n");
    console.log("SearchResults.jsx re-rendering in progress...\n\n");
    let { organic_results } = this.state;
    return (
      <React.Fragment>
        {/* 显示搜索结果 */}
        {this.state.organic_results === [] ? (
          <React.Fragment></React.Fragment>
        ) : (
          <div>
            {organic_results.map((organic_result) => (
              <ul key={organic_result.title}>
                <div>{organic_result.title}</div>
                <div>{organic_result.displayed_link}</div>
                <div>{organic_result.snippet}</div>
                {/* <div>{organic_result.link}</div> */}
              </ul>
            ))}
          </div>
        )}
      </React.Fragment>
    );
  }
}

class SearchResults extends React.Component {
  render() {
    return <Results {...this.props} />;
  }
}

export default SearchResults;
