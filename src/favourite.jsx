import React from "react";

class DisplayFavourite extends React.Component {
  render() {
      console.log(this.props)
    return <div></div>
  }
}

class FavouritePages extends React.Component {
  render() {
    return (
      <React.Fragment>
        <DisplayFavourite {...this.props}/>
      </React.Fragment>
    );
  }
}

export default FavouritePages;
