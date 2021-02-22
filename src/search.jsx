import React from "react";
import { Route, Switch } from "react-router-dom";
import SearchBar from "./searchBar";

class Search extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Switch>
          <Route path="/result" component={SearchBar} />
          <Route path="/" exact component={SearchBar} />
        </Switch>
      </div>
    );
  }
}

export default Search;
