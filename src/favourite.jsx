import React from "react";
import "./favourite.css";
import { Link } from "react-router";
import Address from "./address";
import EmptyState from "./emptyState";
import { AppHeader } from "./header";
import { ArrowLeftIcon, CloseIcon, SearchIcon, StarIcon } from "./icons";
import { HOME_PATH, RESULTS_PATH } from "./routes";
import { favourites, removeFavourite } from "./storage";

/**
 * My Pages 页面：已收藏网页的卡片，每张卡片都可以移除；没有收藏时显示空白提示。
 */
class Favourite extends React.Component {
  constructor(props) {
    super(props);
    this.state = { favourites: favourites() };
  }

  /**
   * 从已收藏网页中移除一个网页，并重新显示 My Pages。
   * @param {Object} page 要移除的网页
   */
  #remove(page) {
    this.setState({ favourites: removeFavourite(page) });
  }

  /**
   * @param {number} count 已收藏网页的数量
   * @returns {string} 标题旁的数量，例如 "2 saved pages"
   */
  #countText(count) {
    if (count === 0) {
      return "No saved pages";
    }
    return count === 1 ? "1 saved page" : `${count} saved pages`;
  }

  render() {
    let saved = this.state.favourites;
    return (
      <div className="page">
        <AppHeader current="favourite" />
        <main className="mypages">
          <Link to={RESULTS_PATH} className="mypages__back link-underline">
            <ArrowLeftIcon />
            Go back
          </Link>
          <div className="mypages__head">
            <h1>My Pages</h1>
            <p className="mypages__count meta-mono" role="status">
              {this.#countText(saved.length)}
            </p>
          </div>
          {saved.length > 0 ? (
            <ul className="saved-grid">
              {saved.map((page, index) => (
                <li key={page.link}>
                  <article className="saved-card">
                    <p className="saved-card__address meta-mono">
                      <Address result={page} />
                    </p>
                    <h2>
                      <a
                        id={"saved-title-" + index}
                        href={page.link}
                        className="link-underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {page.title}{" "}
                        <span className="visually-hidden">(opens in a new tab)</span>
                      </a>
                    </h2>
                    <p className="saved-card__snippet">{page.snippet}</p>
                    <div className="saved-card__actions">
                      <button
                        type="button"
                        className="btn-remove btn-red"
                        aria-describedby={"saved-title-" + index}
                        onClick={() => this.#remove(page)}
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
            <EmptyState
              className="saved-empty"
              level={2}
              icon={<StarIcon size={24} />}
              heading="No saved pages yet"
              body="Use Favourite on a search result to save it here."
            >
              <Link to={HOME_PATH} className="mypages-link">
                <SearchIcon />
                Go to search
              </Link>
            </EmptyState>
          )}
        </main>
      </div>
    );
  }
}

export default Favourite;
