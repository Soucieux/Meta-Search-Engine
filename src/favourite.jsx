import React from "react";
import "./favourite.css";
import ls from "local-storage";
import { Link } from "react-router";
import Address from "./address";
import {
  ArrowLeftIcon,
  CloseIcon,
  PersonCircleIcon,
  SearchIcon,
  StarIcon,
} from "./icons";

/**
 * My Pages 页面：已收藏网页的卡片，每张卡片都可以移除；没有收藏时显示空白提示。
 */
class DisplayFavourite extends React.Component {
  constructor(props) {
    super(props);
    this.state = { favourites: ls.get("favourite websites") || [] };
  }

  /**
   * 从已收藏网页中移除一个网页（按链接识别），并重新显示 My Pages。
   * @param {Object} page 要移除的网页
   */
  removeFavourite(page) {
    let favourites = this.state.favourites.filter(
      (favourite) => favourite.link !== page.link
    );
    ls.set("favourite websites", favourites);
    this.setState({ favourites });
  }

  /**
   * @param {number} count 已收藏网页的数量
   * @returns {string} 标题旁的数量，例如 "2 saved pages"
   */
  countText(count) {
    if (count === 0) {
      return "No saved pages";
    }
    return count === 1 ? "1 saved page" : `${count} saved pages`;
  }

  render() {
    ls.set("load websites filter", true);
    let favourite_stored = this.state.favourites;
    console.log("Favourite websites retrieved from Local Storage\n\n");
    return (
      <div className="mypages-page">
        <header className="app-header">
          <div className="app-header__inner app-header__inner--split">
            <Link to="/" className="app-header__title">
              <img src="/logo.png" alt="" className="app-header__logo" />
              Custom Search
            </Link>
            <Link to="/favourite" className="mypages-link" aria-current="page">
              <PersonCircleIcon size={18} />
              My Pages
            </Link>
          </div>
        </header>
        <main className="mypages">
          <Link to="/results" className="mypages__back">
            <ArrowLeftIcon />
            Go back
          </Link>
          <div className="mypages__head">
            <h1>My Pages</h1>
            <p className="mypages__count" role="status">
              {this.countText(favourite_stored.length)}
            </p>
          </div>
          {favourite_stored.length > 0 ? (
            <ul className="saved-grid">
              {favourite_stored.map((favourite_individual, index) => (
                <li key={favourite_individual.link}>
                  <article className="saved-card">
                    <p className="saved-card__address">
                      <Address displayedLink={favourite_individual.displayed_link} />
                    </p>
                    <h2>
                      <Link
                        id={"saved-title-" + index}
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
                        {favourite_individual.title}{" "}
                        <span className="visually-hidden">(opens in a new tab)</span>
                      </Link>
                    </h2>
                    <p className="saved-card__snippet">{favourite_individual.snippet}</p>
                    <div className="saved-card__actions">
                      <button
                        type="button"
                        className="btn-remove"
                        aria-describedby={"saved-title-" + index}
                        onClick={() => this.removeFavourite(favourite_individual)}
                      >
                        <CloseIcon />
                        Remove
                      </button>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="saved-empty">
              <span className="saved-empty__icon" aria-hidden="true">
                <StarIcon size={24} />
              </span>
              <h2>No saved pages yet</h2>
              <p>Use Favourite on a search result to save it here.</p>
              <Link to="/" className="mypages-link">
                <SearchIcon />
                Go to search
              </Link>
            </div>
          )}
        </main>
      </div>
    );
  }
}

class Favourite extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.location !== undefined &&
          this.props.location.pathname === "/favourite" && (
            <DisplayFavourite {...this.props} />
          )}
      </React.Fragment>
    );
  }
}

export default Favourite;
