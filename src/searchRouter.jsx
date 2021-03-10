import React from "react";
import { Route, Switch } from "react-router-dom";
import Search from "./search";
import Favourite from "./favourite";

class SearchRouter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Switch>
          <Route path="/results" component={Search} />
          <Route path="/" exact component={Search} />
          <Route path="/favourite" component={Favourite} />
        </Switch>
      </div>
    );
  }
}

export default SearchRouter;
