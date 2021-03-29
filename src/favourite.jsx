import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";

// 记录已收藏的网页
var favourite_websites_received = [];

class DisplayFavourite extends React.Component {
  render() {
    console.log("Rendering favourite websites\n\n");
    return (
      <React.Fragment>
        <h1>My Favourite Pages</h1>
        <button onClick={() => this.props.history.push("/results")}>
          Go back
        </button>
        <div className="card-deck">
          {favourite_websites_received[0] !== undefined && (
            <React.Fragment>
              {favourite_websites_received.map((favourite_individual) => (
                <div className="card" key={favourite_individual.position}>
                  <h6 className="card-body">
                    <Link
                      className="card-title"
                      target="_blank"
                      to={
                        "//" +
                        (favourite_individual.link[4] === "s"
                          ? // https
                            favourite_individual.link.slice(
                              8,
                              favourite_individual.link.length
                            )
                          : // http
                            favourite_individual.link.slice(
                              7,
                              favourite_individual.link.length
                            ))
                      }
                    >
                      {favourite_individual.title}
                    </Link>
                    <div className="card-subtitle mb-2 text-muted">
                      {favourite_individual.domain}
                    </div>
                  </h6>
                </div>
              ))}
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

class Favourite extends React.Component {
  render() {
    let { favourite_websites } = this.props;
    if (favourite_websites) {
      favourite_websites_received = favourite_websites;
      console.log("Favourite websites updated\n\n");
    }
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
