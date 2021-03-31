import React from "react";
import "./favourite.css";
import ls from "local-storage";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";

class DisplayFavourite extends React.Component {
  render() {
    var favourite_stored = ls.get("favourite_websites");
    console.log(favourite_stored[0]);
    console.log("Favourite websites retrieved from Local Storage\n\n");
    return (
      <React.Fragment>
        <h2 id="favourite-websites-page-main-title">My Pages</h2>
        <button
          className="btn btn-link"
          id="go-back-to-search-results"
          onClick={() => {
            this.props.history.push("/results");
          }}
        >
          &lt;Go back
        </button>
        <div className="card-columns" id="favourite-websites-list">
          {favourite_stored[0] !== undefined && (
            <React.Fragment>
              {favourite_stored.map((favourite_individual) => (
                <div className="card" key={favourite_individual.title}>
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
