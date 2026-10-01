# Meta Search Engine

![Interface](https://img.shields.io/badge/Interface-React%2017-61dafb) ![Routing](https://img.shields.io/badge/Routing-React%20Router%205-ca4245) ![Styling](https://img.shields.io/badge/Styling-Bootstrap%204-7952b3) ![Language](https://img.shields.io/badge/Language-JavaScript-f7df1e) ![Status](https://img.shields.io/badge/Status-2021%20prototype-9f9f9f)

<!-- project-control:section=overview -->
## Overview

Meta Search Engine is a single-page search front end, created with React in winter term 2021. It
was built to gather results from several search engines into one list: a home page with a search
box, a results page with a websites filter and a search-engine filter, and **My Pages**, a
collection of saved results. Everything it keeps stays in the browser; it has no server of its own.

Only Google results were ever connected, through the ValueSERP search API, and that request has been
commented out since March 2021. The app now shows a bundled sample of six Google results instead, so
it is an interface prototype rather than a live search service.

<!-- project-control:section=overview -->
## Features

The feature list as the project last recorded it, at Version 3.31 in April 2021.

### Completed

- Search bar
- Search results
- Websites filter
- Save favourite websites
- Search engine filter (Google)
- Saved websites collection

### In progress

- Pagination
- Search engine filter (Bing)

### Known bugs

- Search bar reset button & input value
- Favourite page button

### Not yet implemented

- Saved websites presented first with colored background
- Customized searching on google domain,location,gl,hl

<!-- project-control:section=overview -->
## Current state

Checked on 2026-10-01 with Node.js 22.

- **Build:** `npm start` and `npm run build` stop before compiling. The February 2022 dependency
  upgrade moved to webpack 5 and `react-dev-utils` 12, but the webpack configuration in `config/`
  still loads `react-dev-utils/WatchMissingNodeModulesPlugin`, which version 12 no longer has.
- **Last 2021 version:** Version 3.31 also stops on Node.js 22, at a PostCSS package-export error;
  its dependencies predate Node.js 17.
- **Search:** the ValueSERP request in `src/searchResults.jsx` is commented out, so results come from
  the six sample Google results bundled in that file. A leftover development line sets the previous
  query to `123` on every render, which makes `123` the only query that shows them; any other query
  shows no results.
- **Tests:** there are no test files, and `npm test` cannot start on a Mac either, because
  `package.json` points Jest's test runner at a Windows path (`D:\MetaData-Search-Engine\…`).

## Quick start

Requires Node.js and npm. Run every command from this folder.

```bash
npm install
npm start
```

- `npm start` serves the app at http://localhost:3000; set `PORT` or `HOST` to change where it
  listens.
- `npm run build` writes a production build to `build/`.
- `npm test` runs Jest.

Both `npm start` and `npm run build` currently stop before compiling; see
[Current state](#current-state).

<!-- project-control:section=workflows -->
## Workflow

```text
Search and filter
Type a query on the home page and press Enter
  ↓
The results page lists the bundled sample results
  ├─→ Untick a website to hide its results
  └─→ Turn Google off to hide every Google result

Save a page
Choose Favourite beside a result
  ↓
The result joins the saved list in this browser
  ↓
Open My Pages from the profile icon
  ↓
Open a saved page, or go back to the results
```

<!-- project-control:section=architecture -->
## Architecture

The app runs entirely in the browser. `src/index.jsx` mounts the router, class components draw the
three pages, and every piece of state lives in the browser's local storage.

### Frontend & Presentation

| Technology or concept | Use in this project |
|---|---|
| React 17 | Class components draw the search page, the results page and My Pages. |
| React Router 5 | `BrowserRouter` maps `/` to the search page, `/results` to the results page and `/favourite` to My Pages. |
| Bootstrap 4 | Its stylesheet styles the buttons, list groups and cards. |
| Bootstrap Icons | The search, information and profile icons are its artwork, inlined as SVG. |
| CSS | `search.css`, `searchResults.css` and `favourite.css` lay out each page. |

### Data & Storage

| Technology or concept | Use in this project |
|---|---|
| Browser local storage | Through the `local-storage` package, it keeps the current and previous query, the cached results, the websites filter's state and the saved pages. |
| Bundled sample results | Six Google results for a McDonald's search, defined in `src/searchResults.jsx`. |

### Integrations & Security

| Technology or concept | Use in this project |
|---|---|
| ValueSERP API | Supplied Google results during development; the request is commented out, and the key it carried reads `REDACTED`. |

### Build & Delivery

| Technology or concept | Use in this project |
|---|---|
| Create React App 4 configuration | Ejected into `config/` and `scripts/`, with `html/` serving as the public folder instead of `public/`. |
| webpack | Bundles the app for `npm start` and `npm run build`; see [Current state](#current-state). |
| Babel | Compiles the JSX with the `react-app` preset. |
| ESLint | Checks the source during builds with the `react-app` configuration. |
| Jest | Configured in `package.json`; there are no tests yet. |

## Project map

| Path | Contents |
|---|---|
| `src/` | The React components, their stylesheets and the bundled sample results. |
| `html/` | `index.html`, the web app manifest, the favicon, the Google and Bing filter icons, and the home-page image, a Bing wallpaper the home page credits. |
| `config/` | The ejected webpack, development-server, Jest and path configuration. |
| `scripts/` | The `start`, `build` and `test` scripts that `package.json` runs. |

<!-- project-control:section=ignore -->
## Contributing

For source changes, follow the [Meta Search Engine contribution guide](CONTRIBUTING.md).

<!-- project-control:section=history -->
## Change history

**Change-history numbering:** This project uses dated history and does not assign project-level
version or build numbers. Follow the [version and build policy](CONTRIBUTING.md#version-and-build-policy).

The 2021 commits carry the project's own development labels, from V 0.2.1 to Version 3.31. The
records below keep them as history; they are not project versions.

One record per change; complete details and evidence are below. Older work dates and Git checkpoints remain labelled when they differ.

**Historical status:** Each record describes its own delivery checkpoint. Later records supersede older pending work or recovery locations; historical checks are not new validation.

| Record | Date | Highlights | Details |
|---|---|---|---|
| Maintenance | 2026-10-01 | <ul><li><strong>Dependencies:</strong> <code>node_modules</code> is gone from every commit and ignored, so dependencies come from <code>npm install</code>.</li><li><strong>Credentials:</strong> The three API keys earlier commits carried read <code>REDACTED</code> in every commit.</li><li><strong>Authorship:</strong> Commits that named a personal email address now name the author's GitHub noreply address.</li><li><strong>Documentation:</strong> This README gained the current state, setup, architecture, workflow and change history, and a contribution guide was added.</li></ul> | [Full record](#history-cleanup) |
| Maintenance | 2026-10-01 | <ul><li><strong>Dependency:</strong> <code>package.json</code> requires <code>semver</code> 7.5.2 instead of 7.3.2, a Dependabot security update.</li></ul> | [Full record](#semver-update) |
| Maintenance | 2022-09-11 | <ul><li><strong>Security updates:</strong> Dependabot updated url-parse, node-forge, minimist, async, eventsource and terser.</li><li><strong>Lock file:</strong> <code>package-lock.json</code> was removed, so installs resolve the ranges in <code>package.json</code>.</li></ul> | [Full record](#dependency-security-updates) |
| Maintenance | 2022-02-15 | <ul><li><strong>Build dependencies:</strong> Moved to webpack 5, webpack-dev-server 4 and <code>react-dev-utils</code> 12.</li><li><strong>Effect:</strong> The webpack configuration was not updated to match, so the app has not built since.</li></ul> | [Full record](#webpack-5-upgrade) |
| Maintenance | 2021-04-07 | <ul><li><strong>Favourites:</strong> Versions 3.0 to 3.31 added saving results and the My Pages collection.</li><li><strong>Websites filter:</strong> The filter remembers its state in the browser and lost a run of bugs.</li><li><strong>Sample results:</strong> Six bundled Google results replaced the live request.</li></ul> | [Full record](#favourite-pages) |
| Maintenance | 2021-03-08 | <ul><li><strong>Search results:</strong> Versions 2.0 to 2.22 added the results page.</li><li><strong>Filters:</strong> A websites filter and a Google search-engine filter narrow the results.</li><li><strong>Home page:</strong> A full-page image and a return to it when no query is set.</li></ul> | [Full record](#search-results-and-filters) |
| Maintenance | 2021-02-22 | <ul><li><strong>Search bar:</strong> Versions 1.0 to 1.10 built the search box, its submit and clear buttons, and the route to the results page.</li></ul> | [Full record](#search-bar) |
| Maintenance | 2021-02-19 | <ul><li><strong>Beginnings:</strong> A static page template, a Node.js server with a Google Custom Search trial, and then the React app with Bootstrap.</li></ul> | [Full record](#first-prototypes) |

<details>
<summary>Full records for this table</summary>

<a id="history-cleanup"></a>

### History cleanup and contribution guide — 2026-10-01

- **Dependencies:** the committed `node_modules` folder is gone from every commit, and
  `.gitignore` now ignores the whole folder instead of its cache alone, so dependencies come from
  `npm install` rather than the repository. The project's history packs to 1.4 MiB instead of
  88.7 MiB.
- **Commits:** the four commits that changed nothing but `node_modules` — Version 3.4 and
  Versions 3.12 to 3.14 — were left out. The remaining commits keep their authors and dates, and
  their messages apart from the commit id that the revert of Version 3.23 cites; every commit id
  changed.
- **Credentials:** the ValueSERP API key in `src/searchBar.jsx`, later `src/searchResults.jsx`, and
  the two Google API keys in the February 2021 `server.js` and `main/main.html` read `REDACTED` in
  every commit. No other key-shaped value remains in the history.
- **Authorship:** the 26 commits that named a personal email address now name the author's GitHub
  noreply address.
- **Documentation:** this README keeps the 2021 feature list and patch notes and adds the current
  state, setup, workflow, architecture, project map and this change history.
  [CONTRIBUTING.md](CONTRIBUTING.md) states how changes are made and checked.
- **Unchanged:** the application source and its dependencies, so the build failure recorded under
  [Current state](#current-state) remains.
- **Status:** delivered uncommitted on 2026-10-01, then committed the same day as `e94fd7b` (the
  import with its history), `cebf8ba` and `40db4af`.

[Back to change history](#change-history)

<a id="semver-update"></a>

### semver security update — 2026-10-01

- **Dependency:** `package.json` requires `semver` 7.5.2 instead of 7.3.2. Dependabot opened the
  update as pull request #8 on 2025-12-03, and it was merged on 2026-10-01.

[Back to change history](#change-history)

<a id="dependency-security-updates"></a>

### Dependabot security updates — 2022-02-28 to 2022-09-11

- **Merged:** url-parse 1.5.10 (pull request #1, 2022-02-28) and async 2.6.4 (#4, 2022-05-19);
  node-forge 1.3.0, minimist 1.2.6, eventsource 1.1.1 and terser 4.8.1 (#2, #3, #5 and #6, all on
  2022-09-11). Only node-forge changed `package.json`; the others changed the lock file.
- **Closed:** pull request #7, which updated ejs and workbox-webpack-plugin, was closed without
  merging.
- **Lock file:** `package-lock.json` was deleted on 2022-09-11, so installs resolve the version
  ranges in `package.json`.

[Back to change history](#change-history)

<a id="webpack-5-upgrade"></a>

### Dependency upgrade to webpack 5 — 2022-02-15

- **Change:** the "Upgrade modular" commit and two "Update node-modules" commits moved the build
  dependencies to webpack 5.69, webpack-dev-server 4.7, `react-dev-utils` 12, css-loader 6,
  postcss-loader 6, postcss-preset-env 7 and `@svgr/webpack` 6, added node-forge, and refreshed the
  committed `node_modules`.
- **Effect:** the webpack configuration in `config/` still came from Create React App 4 and requires
  `react-dev-utils/WatchMissingNodeModulesPlugin`, which `react-dev-utils` 12 does not include. Since
  this change, `npm start` and `npm run build` stop at that missing module.

[Back to change history](#change-history)

<a id="favourite-pages"></a>

### Favourite pages, Versions 3.0 to 3.31 — 2021-03-09 to 2021-04-07

- **Patch notes:** "Version 3.0 ~ Present", from March 9, 2021: save favourite websites, the saved
  websites collection, and websites filter improvements.
- **Favourites:** 3.0 to 3.2 added the favourite page and passed saved results to it; 3.17 to 3.19
  reworked its layout and the rules for adding and removing a page.
- **Browser storage:** 3.15 cached the app's data in local storage, 3.20 kept the query across a
  refresh, and 3.22 fixed a storage bug.
- **Websites filter:** 3.21 and 3.25 to 3.29 fixed filter bugs. 3.24 fixed the Google toggle after
  3.23's change to store it was reverted.
- **Home page:** 3.17 replaced the home-page image with `html/main.jpg`, a Bing wallpaper.
- **Sample results:** 3.29 bundled the six sample Google results and the `123` development query
  that [Current state](#current-state) describes.
- **Dependencies:** 3.10 and 3.11 began committing `node_modules`.
- **Documentation:** 3.5, 3.7 to 3.9, 3.16, 3.28, 3.30 and 3.31 updated this README's progress.

[Back to change history](#change-history)

<a id="search-results-and-filters"></a>

### Search results and filters, Versions 2.0 to 2.22 — 2021-02-22 to 2021-03-08

- **Patch notes:** "Version 2.0 ~ 2.22", February 22, 2021 ~ March 8, 2021: search results, the
  websites filter, and the search engine filter (Google).
- **Results page:** 2.0 to 2.4 added the results page and its layout, and 2.18 combined the results
  into one list.
- **Websites filter:** 2.5 to 2.17 built the filter of the result's websites, and 2.19 made it
  remember its state.
- **Search engine filter:** 2.10 to 2.15 added the Google and Bing icons, moved the filter to the
  home page and made it apply on every page.
- **Home page:** 2.20 and 2.21 added a full-page image, and 2.22 returns to the home page when there
  is no query.
- **Live results:** the ValueSERP request ran in 2.4 to 2.8 and in 2.18, and has been commented out
  since 2.19.
- **Documentation:** the six 2.6 commits updated this README's progress.

[Back to change history](#change-history)

<a id="search-bar"></a>

### Search bar, Versions 1.0 to 1.10 — 2021-02-20 to 2021-02-22

- **Patch notes:** "Version 1.0 ~ 1.10", February 20, 2021 ~ February 22, 2021: the search bar.
- **Search box:** 1.0 added the search input and button, 1.1 aligned them, and 1.2 added a button
  that clears the input.
- **Structure:** 1.3 to 1.5 split the code into components and moved the page shell and its assets
  into `html/`; 1.6 fixed navigation to the results page.
- **Search bar and results:** 1.7 and 1.8 merged the search bar and the results, 1.9 added comments
  and the first live ValueSERP request, and 1.10 separated the two again behind a router.

[Back to change history](#change-history)

<a id="first-prototypes"></a>

### First prototypes — 2020-12-09 to 2021-02-19

- **Static page:** on 2020-12-09 the repository began with a single-page HTML template, its
  stylesheet and images, and a README.
- **Node.js server:** on 2021-02-05 a small Node.js server replaced the template, serving
  `main/main.html` with a commented-out Google Custom Search sample and the `googleapis` package.
- **React app:** on 2021-02-18 and 2021-02-19 the project moved to a React app from the Create
  React App template, ejected into `config/` and `scripts/`, and V 0.2.1 added Bootstrap.

[Back to change history](#change-history)

</details>

---

<!-- project-control:section=ignore -->
## 🔒 License

**PROPRIETARY SOFTWARE — ALL RIGHTS RESERVED**

Copyright © 2024–2026 Soucieux. All rights reserved.

The original source code, documentation, and other original materials in this repository are proprietary and are not open-source software.

Except where applicable law expressly permits otherwise, no permission is granted to copy, modify, publish, distribute, sublicense, sell, deploy, or create derivative works from these materials, in whole or in part, without prior written authorization from the copyright owner.

Access to this repository does not grant a license. Third-party software and materials remain subject to their respective license terms.

*This private project is not open for external contributions.*
