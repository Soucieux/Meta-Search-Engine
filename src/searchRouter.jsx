import React from "react";
import { Route, Switch } from "react-router-dom";
import SearchBar from "./searchBar";
import Favourite from "./favourite";

class SearchRouter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Switch>
          <Route path="/results" component={SearchBar} />
          <Route path="/" exact component={SearchBar} />
          <Route path="/favourite" component={Favourite} />
        </Switch>
      </div>
    );
  }
}

export default SearchRouter;
