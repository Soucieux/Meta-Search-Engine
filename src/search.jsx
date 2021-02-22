import React from "react";
import { Route, Switch } from "react-router-dom";
import SearchBar from "./searchBar";
import SearchResult from "./searchResult";

class Search extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Switch>
          <Route path="/result" component={SearchResult} />
          <Route path="/" exact component={SearchBar} />
        </Switch>
      </div>
    );
  }
}

export default Search;
