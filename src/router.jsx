import React from "react";
import Search from "./search";
import Favourite from "./favourite";
import { Route, Switch } from "react-router-dom";

class Router extends React.Component {
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

export default Router;
