import React from "react";
import { Title, InputAndButton } from "./searchBar";
import "./searchBar.css";
import "bootstrap/dist/css/bootstrap.css";

class Result extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="search-title-revised">
        <Title />
        <InputAndButton />
      </div>
    );
  }
}

class SearchResult extends React.Component {
  render() {
    return (
      <div>
        <Result {...this.props} />
      </div>
    );
  }
}

export default SearchResult;
