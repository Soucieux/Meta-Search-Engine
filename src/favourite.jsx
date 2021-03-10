import React from "react";

class DisplayFavourite extends React.Component {
  render() {
    return (
      <div>
        <h1>123123</h1>
      </div>
    );
  }
}

class Favourite extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.match !== undefined &&
          this.props.match.url === "/favourite" && (
            <DisplayFavourite {...this.props} />
          )}
      </React.Fragment>
    );
  }
}

export default Favourite;
