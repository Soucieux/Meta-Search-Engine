import React from "react";
import { Route, Switch } from "react-router-dom";
import Search from "./search";
import SearchResult from "./searchResult";

class SearchRoute extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Switch>
          <Route path="/result" component={SearchResult} />
          <Route path="/" exact component={Search} />
        </Switch>
      </div>
    );
  }
}

export default SearchRoute;
