import React from "react";
import "./favourite.css"
import ls from "local-storage";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";

class DisplayFavourite extends React.Component {
  render() {
    var favourite_websites_stored = ls.get("favourite_websites");
    console.log("Favourite websites retrieved from Local Storage\n\n");
    return (
      <React.Fragment>
        <h1 id="favourite-websites-title">My Favourite Pages</h1>
        <button onClick={() => this.props.history.push("/results")}>
          Go back
        </button>
        <div className="card-deck" id="favourite-websites-list">
          {favourite_websites_stored[0] !== undefined && (
            <React.Fragment>
              {favourite_websites_stored.map((favourite_individual) => (
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
    if (favourite_websites && favourite_websites[0] != undefined) {
      console.log("are you here");
      ls.set("favourite_websites", favourite_websites);
      console.log("Favourite websites stored in Local Storage\n\n");
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
