# Meta Search Engine

![Platform](https://img.shields.io/badge/Platform-Browser-blue) ![React](https://img.shields.io/badge/React-19-orange) ![History](https://img.shields.io/badge/History-dated-9f9f9f) ![Routing](https://img.shields.io/badge/Routing-React%20Router%208-ca4245) ![Styling](https://img.shields.io/badge/Styling-Bootstrap%205-7952b3) ![Status](https://img.shields.io/badge/Status-2021%20prototype-9f9f9f)

[Overview](#overview) · [Capabilities](#capabilities) · [Quick start](#quick-start) · [Workflow](#workflow) · [Architecture](#architecture) · [Project structure](#project-structure) · [Contributing](#contributing) · [Change history](#change-history)

<!-- project-control:section=overview -->
## Overview

Meta Search Engine is a single-page search front end, created with React in winter term 2021.

- It was built to gather results from several search engines into one list: a home page with a
  search box, a results page with a websites filter and a search-engine filter, and **My Pages**, a
  collection of saved results.
- Everything it keeps stays in the browser.

It searches the **live web** through Tavily, a web search service with a free monthly allowance.

- The Tavily key stays with the local development server, which passes each query on.
- Google and Bing are shown but unavailable: only Google was ever connected, through the ValueSERP
  search API; that request was commented out in March 2021 and removed on 2026-10-02.

<!-- project-control:section=overview -->
## Capabilities

The feature list as the project recorded it at Version 3.31 in April 2021.

- Its two known bugs, and two layout bugs found later, were fixed on 2026-10-01.
- Since 2026-10-02 saved websites have been listed first, and the results come from the live web
  through Tavily, which the search-engine filter switches on and off.

### Completed

- Search bar
- Search results
- Websites filter
- Save favourite websites
- Search engine filter (Google)
- Saved websites collection
- Saved websites presented first with colored background

### In progress

- Pagination
- Search engine filter (Bing)

### Known bugs

None known.

### Not yet implemented

- Customized searching on google domain,location,gl,hl

<!-- project-control:section=overview -->
### Current state

Checked on 2026-10-02 with Node.js 22.

- **Build:** Vite serves the app with `npm start` and builds it with `npm run build`.
- **Search:** every query asks Tavily for 10 live results through the development server and lists
  them in Tavily's order. Without a Tavily key, or once the month's free searches are used up, the
  results page says why. Google and Bing are unavailable.
- **Tests:** `npm test` runs 53 tests: the app's pages, filters, favourites and saved state
  against a stand-in for Tavily, the live search's answers and refusals, and the snippets with
  their bold search words.

## Quick start

Requires Node.js 22.22 or newer, and npm. Live search needs a free API key from
[Tavily](https://tavily.com). Run every command from this folder.

```bash
npm install
npm start
```

1. First create `.env.local` in this folder with the line `TAVILY_API_KEY=` followed by your Tavily
   key. Only the development server reads it, and the page never receives it; the server restarts
   by itself when `.env.local` changes.
2. `npm start` serves the app at http://localhost:3000; add `-- --port <number>` to use another port.

Each search uses one of Tavily's free monthly searches, 1,000 on the free plan in October 2026.
Without a key, the results page says how to add one.

- `npm run build` writes a production build to `build/`. Live search needs a server that holds the
  key, so a build searches only when `npm run preview` serves it.
- `npm run preview` serves that build at http://localhost:3000, with live search.
- `npm test` runs the tests once.

<!-- project-control:section=workflows -->
## Workflow

```text
Search and filter
Type a query on the home page and press Enter
  ↓
The development server asks Tavily for live results
  ↓
The results page lists Tavily's top ten
  ├─→ Untick a website to hide its results
  └─→ Turn Web off to hide its results

Save a page
Choose Favourite beside a result
  ↓
The result is highlighted and joins the saved list in this browser
  ↓
Saved results lead the list the next time it is drawn
  ↓
Open My Pages from the My Pages link
  ↓
Open a saved page, remove it, or go back to the results
```

<!-- project-control:section=architecture -->
## Architecture

The app runs in the browser. `src/index.jsx` mounts the router, class components draw the three
pages, and every piece of state lives in the browser's local storage. `src/webSearch.js` asks the
development server's `/live/search` address for live results, which `scripts/liveSearch.js` fetches
from Tavily with the key in `.env.local`.

### Frontend & Presentation

| Technology or concept | Use in this project |
|---|---|
| React 19 | Class components draw the home page, the results page and My Pages; function components draw the shared header, the empty states, the addresses and the icons. |
| React Router 8 | `BrowserRouter` maps `/` to the home page, `/results` to the results page and `/favourite` to My Pages; `src/router.jsx` hands each page the current location and a `navigate` function, since class components cannot call the router's hooks. |
| Bootstrap 5 | Its reboot stylesheet supplies the base styles and loads first, so the project's stylesheets draw the pages; the `visually-hidden` helper is copied into `search.css`, and the rest of Bootstrap is not loaded. |
| Bootstrap Icons | Its glyphs mark the buttons and links, inlined as SVG in `src/icons.jsx`; there is no icon package. |
| CSS | The design's colours, type, radii, page width and focus ring are variables at the top of `search.css`, which also styles the header the results page and My Pages share (`src/header.jsx`); `searchResults.css` and `favourite.css` lay out each page. |
| IBM Plex Sans and Mono | The interface and the addresses, counts and labels. The font files ship with the app through the Fontsource packages (Latin subset), so the page loads nothing from Google Fonts; without them, every font falls back to the system font. |

### Data & Storage

| Technology or concept | Use in this project |
|---|---|
| Browser local storage | Through `src/storage.js`, a small module over the browser's `localStorage` that stores each value as JSON, it keeps the current and previous query, the last results and whether live search answered, the websites hidden by the filter, and the saved pages;<br>the module names every key and reads and writes the saved pages. |
| `.env.local` | Holds this computer's Tavily key, read only by the development and preview servers; it is never committed. |

### Integrations & Security

| Technology or concept | Use in this project |
|---|---|
| ValueSERP API | Supplied Google results during development in 2021; the request was removed on 2026-10-02, and the key it carried reads `REDACTED` in the history. |
| Tavily Search API | Supplies the live results, the only hosted service the app talks to.<br>The development and preview servers send each query to Tavily's basic search with the key from `.env.local` and pass only each result's title, address and excerpt to the page.<br>The key never reaches the browser, and the servers answer only the app's own page. |

### Build & Delivery

| Technology or concept | Use in this project |
|---|---|
| Vite | Serves the app for `npm start` and builds it into `build/` for `npm run build`, with `html/` as its public folder; its development and preview servers answer `/live/search`. |
| Vite React plugin | Compiles the JSX and refreshes changed components while the development server runs. |
| Vitest | Runs the tests in `src/` and `scripts/` for `npm test`; in a simulated browser page from jsdom, React Testing Library drives the app through its router against a stand-in for Tavily. |
| Scripts | `scripts/liveSearch.js` is the servers' live search, which asks Tavily. |

## Project structure

| Path | Contents |
|---|---|
| `index.html` | The page Vite serves and builds, which loads `src/index.jsx`. |
| `vite.config.js` | The Vite configuration: the React plugin, the live search, the `html/` public folder, port 3000, the `build/` folder and the test environment. |
| `src/` | The React components (`search.jsx` for the home and results pages, `searchResults.jsx`, `favourite.jsx`, the shared `header.jsx` and `emptyState.jsx`), their stylesheets, the icons, the web search, the addresses in `routes.js`, the local storage in `storage.js`, and the tests. |
| `scripts/` | The servers' live search and its tests. |
| `html/` | The web app manifest, the favicon and the header logo made from the project icon, and the home-page image, a Bing wallpaper the home page credits. |
| `.env.local` | This computer's Tavily key; not committed. |
| `Resources/` | The 1,024-pixel project icon master, kept outside `html/` so the build does not serve it. |

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
| Documentation | 2026-10-05 | <ul><li><strong>Alignment:</strong> The badge row now opens with the platform and names the history mode; the JavaScript badge went, as the Architecture table names the language.</li></ul> | [Full record](#readme-alignment) |
| Documentation | 2026-10-05 | <ul><li><strong>Structure:</strong> Sections follow the order and names every project README now shares, under a contents line; sections were renamed and moved, and no wording was removed.</li></ul> | [Full record](#readme-skeleton) |
| Documentation | 2026-10-05 | <ul><li><strong>Readability:</strong> Long paragraphs, bullets and table cells are now short leads with sub-points, one fact each; no detail was removed.</li></ul> | [Full record](#readme-structure) |
| Maintenance | 2026-10-02 | <ul><li><strong>Name:</strong> The app is MetaData Search Engine on the page, in the browser tab and in the web app manifest.</li><li><strong>Links:</strong> Results and saved pages open at their own address, https included; bold search words now work in accented and Chinese text.</li><li><strong>Filters:</strong> Ticking a website or switching Web no longer adds a browser history entry, switching Web on the home page keeps the typed query, the Web switch keeps its setting across a reload, and submitting the same query again searches again.</li><li><strong>Lighter:</strong> Only Bootstrap's base styles load, the IBM Plex fonts ship with the app instead of coming from Google Fonts, and the page's debug logging is gone.</li></ul> | [Full record](#source-simplification) |
| Maintenance | 2026-10-02 | <ul><li><strong>Header:</strong> The page title and its icon are larger, as tall as the search box and buttons beside them.</li></ul> | [Full record](#header-title) |
| Maintenance | 2026-10-02 | <ul><li><strong>Search:</strong> Queries now search the live web through Tavily's free search service, ten results at a time.</li><li><strong>Key:</strong> Your Tavily key stays with the local development server; the page never receives it.</li><li><strong>Sources:</strong> Web is the switchable source; Google and Bing show as unavailable.</li></ul> | [Full record](#live-web-search) |
| Maintenance | 2026-10-02 | <ul><li><strong>Look:</strong> A refreshed interface keeps the three pages and their colours, with IBM Plex type and complete hover, focus and empty states.</li><li><strong>Home:</strong> The Bing photo sits under a soft dark wash, with the search box and sources in one white panel.</li><li><strong>My Pages:</strong> Cards show each page's address and snippet, and Remove takes a page off the list.</li></ul> | [Full record](#interface-refresh) |
| Maintenance | 2026-10-02 | <ul><li><strong>Frameworks:</strong> React 19, React Router 8 and Bootstrap 5 replace React 17, React Router 5 and Bootstrap 4, and the pages look as they did.</li><li><strong>Node.js:</strong> The app needs Node.js 22.22 or newer.</li><li><strong>Dependencies:</strong> <code>react-router-dom</code>, <code>jquery</code> and <code>popper.js</code> are no longer installed.</li></ul> | [Full record](#framework-upgrade) |
| Maintenance | 2026-10-02 | <ul><li><strong>Saved results:</strong> The results page lists saved results first, on a pale yellow background, one of the 2021 features not yet built.</li></ul> | [Full record](#saved-results-first) |
| Maintenance | 2026-10-02 | <ul><li><strong>Tests:</strong> <code>npm test</code> runs Vitest tests that drive the app in a simulated browser: search, the clear button, both filters, favourites, My Pages and a reload.</li></ul> | [Full record](#automated-tests) |
| Maintenance | 2026-10-01 | <ul><li><strong>Layout:</strong> The results header and the My Pages icon fit windows from 1,280 pixels wide, and each website filter's tick box sits beside the site's name.</li><li><strong>Dependencies:</strong> Seven packages nothing imported left <code>package.json</code>; the app needs six.</li></ul> | [Full record](#layout-and-dependency-cleanup) |
| Maintenance | 2026-10-01 | <ul><li><strong>Build:</strong> Vite replaces the ejected Create React App setup, so <code>npm start</code> and <code>npm run build</code> work again on current Node.js.</li><li><strong>Search:</strong> Every query shows the bundled sample results, not only <code>123</code>.</li><li><strong>Bugs:</strong> The clear button empties the search box, and favourite buttons remember saved pages without saving one twice.</li><li><strong>Dependencies:</strong> An install adds 124 packages instead of about 920, and the security alerts were all in removed build tools.</li></ul> | [Full record](#vite-build-and-bug-fixes) |
| Maintenance | 2026-10-01 | <ul><li><strong>Icon:</strong> Added the project icon, three sources flowing into one magnifier on a light blue tile, in the macOS icon shape; its 1,024-pixel master lives in <code>Resources/</code>.</li><li><strong>Browser:</strong> The favicon, until now React's default logo, is a multi-size copy of the same icon.</li><li><strong>Finder:</strong> The project folder's icon is set from the same master.</li></ul> | [Full record](#project-icon) |
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

<a id="readme-alignment"></a>

### README aligned with the other projects — 2026-10-05

- **Why:** every project README shares one structure; this one still lacked part of it.
- **Badges:** Platform, React, History, Routing, Styling and Status; the Language badge went, as the Architecture table names JavaScript.
- **Unchanged:** every sentence inside the sections that stayed; links to a moved part were updated.
- **Scope:** Documentation only.

[Back to change history](#change-history)

<a id="readme-skeleton"></a>

### README sections in the shared order — 2026-10-05

- **Why:** project READMEs named and ordered the same kinds of section differently, so setup, workflow and
  architecture sat in a different place in each.
- **Order:** the sections now run Overview, Capabilities, Quick start, Workflow, Architecture, Project structure, Contributing, Change history.
- **Renamed:** Features is now Capabilities, and Project map is Project structure.
- **Moved:** Current state now sits under Capabilities.
- **Opening:** a contents line under the title links every section.
- **Unchanged:** every sentence, table, diagram and Project Control marker inside the sections; whole sections
  moved, and links to a renamed section were updated.
- **Scope:** Documentation only.

[Back to change history](#change-history)

<a id="readme-structure"></a>

### README laid out as short points — 2026-10-05

- **Why:** many records and some guidance ran as bullets or paragraphs of 50 to 100 words, which hid
  the separate facts inside them.
- **Layout:** every paragraph, bullet and table cell over 50 words is now a short lead with
  sub-points, one fact each. The wording was moved, not rewritten.
- **Unchanged:** every section, heading, link, anchor, table row, diagram, number and identifier.
- **Evidence:** compared with the previous version, no word is removed, and the headings, anchors,
  links, code spans, numbers and fenced samples are identical. The README layout, link and history
  checks pass.
- **Scope:** Documentation only; no source or dependency changed.

[Back to change history](#change-history)

<a id="source-simplification"></a>

### Simpler source, truer links — 2026-10-02

- **Name:**
  - the app calls itself MetaData Search Engine everywhere: the home page title, the header, the
    browser tab and the web app manifest, which used to read "Custom Search", "Search Engine" and
    "MetaData-Search-Engine".
  - The header's first column, which the websites filter shares so the search box lines up with the
    results, widened from 260 to 330 pixels to hold the name on one line beside its icon.
- **Links:**
  - a result's title and a saved page's title are plain links to the page's own address.
  - Until now they dropped the `https:` or `http:` prefix and let the browser reuse the app's own
    scheme, so from the development server every page opened over plain http.
  - Both links tell a screen reader that they open a new tab.
- **Search words:** the bold search words in a snippet now include words that start with an
  accented or non-Latin letter, such as *école* or *北京*; the old word boundary only recognised
  ASCII letters.
- **Search box:** the clear button appears whenever the box has text, on the results page too,
  and the box is a controlled input instead of being read and cleared through the document.
  Search runs when the form is submitted, so Enter and the Search button share one handler.
- **Filters:**
  - ticking a website or switching the Web source redraws the page without navigating, so the Back
    button no longer has to step through every click.
  - Switching Web on the home page keeps the typed query, which it used to clear.
  - The hidden websites are the filter's only stored state;
    - the stored list of tick-box rows, its reload flag and the "new input" flag are gone, and a
      query typed on the home page is searched when the results page is opened directly, where the
      missing filter state used to stop the page.
  - Submitting the same query a second time searches again; it used to clear the websites filter and
    show the old results.
  - The Web switch keeps its setting across a reload; it used to come back on every time the page
    loaded.
- **Fonts and stylesheet:**
  - IBM Plex Sans and Mono ship with the app through the Fontsource packages, so the page no longer
    fetches a stylesheet and fonts from Google Fonts before it can draw; only the Latin subset is
    bundled, and other scripts fall back to the system font.
  - Only Bootstrap's reboot styles load, with the `visually-hidden` helper copied into `search.css`;
    nothing else in Bootstrap matched the pages.
  - The header the results page and My Pages share, the page background, the address styling, the
    empty-state block, the grey monospace text style, the hover underline and the red button colours
    are each one rule in `search.css`,
  - and the page width, gutter, header height, first-column width and the remaining literal colours
    and radii are variables there.
- **Code:**
  - `src/storage.js` is the app's own local-storage module, replacing the `local-storage` package
    and the `global` shim Vite carried for it: it names every key once, reads and writes values as
    JSON, and holds the saved-pages reads and writes that two pages shared.
  - `src/routes.js` names the three addresses;
    - `src/header.jsx` draws the shared header and the My Pages link;
    - `src/emptyState.jsx` draws the empty states of the results page and My Pages;
    - the live search's status words live in `src/webSearch.js` for the server and the page alike,
      its highlighter compiles the search words once per page, and the server passes an untitled
      result's empty title through for the page to replace with the website.
  - The home page and the results page are two components instead of one that branched on the
    address, each component's internals are private members, every method has a documentation
    comment, and the 28 debugging lines the pages printed to the browser console are gone.
  - The commented-out 2021 ValueSERP request and the two helpers only it used are removed; the
    project history above keeps the account of it.
- **Files:** `index.html` carries a real description, no longer blocks dragging on the whole page,
  and names the script that fills it; the web app manifest lists the favicon and logo as icons;
  `package.json` states the Node.js 22.22 requirement; `.gitignore` ignores Finder's folder-icon
  file, which the root ignore rules already covered.
- **Checks:**
  - 53 tests pass, nine of them new:
    - the form submit path,
    - a repeated submit searching again,
    - a query typed before the results page is opened directly,
    - a new search clearing the websites filter,
    - the Web switch kept across a reload and on by default on a first visit,
    - the accented and Chinese search words,
    - a snippet with no search words,
    - and the untitled result named after its website.
  - `npm run build` succeeds, and a build given a made-up Tavily key contains no trace of it.
  - In the desktop app's browser pane (Chromium) at 1,280 and 1,440 pixels wide,
    - the home page, the results page with a saved result, My Pages with and without a saved page
      and the results page's no-key message drew as designed,
    - the header title sat in the 40-pixel band beside the search box,
    - the bundled fonts loaded,
    - nothing scrolled sideways and there were no console errors.

[Back to change history](#change-history)

<a id="header-title"></a>

### Header title — 2026-10-02

- **Header:** on the results page and My Pages, the project icon and "Custom Search" match the
  search box and the header's buttons in size: the icon is as tall as they are, 40 pixels, with the
  same top and bottom edges, and the 24-pixel text sits on their centre line.
- **Checks:** in headless Chromium at 1,280 and 1,440 pixels wide, the icon, the search box, the
  Search, Web and My Pages buttons all measured from 12 to 52 pixels down the page, and the middle
  of the title's letters measured 32 pixels, the centre of that band.

[Back to change history](#change-history)

<a id="live-web-search"></a>

### Live web search — 2026-10-02

- **Search:**
  - each query goes from the page to the development server's `/live/search` address, which asks
    Tavily's basic search for 10 live results with the key in `.env.local` and passes back each
    result's title, address and excerpt, without the Markdown marks Tavily sometimes leaves in an
    excerpt.
  - The results page lists them in Tavily's order with each page's address, title and a snippet that
    bolds the search words; the websites filter, Favourite, saved results first and My Pages work on
    them as before, and a line under the results names Tavily.
  - The six McDonald's sample results are gone.
- **Key and limits:**
  - the key stays on the development or preview server; the page never receives it, and the server
    answers only requests from the app's own page.
  - Without a key, with a key Tavily refuses, once the month's free searches are used up, or when
    Tavily does not answer, the results page says which and what to do.
- **Sources:** Web is the source the toggle switches; Google and Bing show as unavailable.
- **Checks:**
  - 45 tests pass, and `npm run build` builds 105 modules with no trace of the key, which the build
    was given.
  - On the development server, a search with no key showed how to add one, a made-up key came back
    from Tavily as refused, and a request marked as coming from another website was turned away.
  - With a real key, a search for “best pizza in ottawa” listed Tavily's 9 live results in their
    order in headless Chromium at 1,280 and 1,440 pixels wide, with no sideways scrolling and no
    console errors.
  - `.env.local` is ignored by Git and has never been committed.

[Back to change history](#change-history)

<a id="interface-refresh"></a>

### Interface refresh — 2026-10-02

- **Look:**
  - the three pages keep their layout and colours: the red Search and Remove buttons, the sage
    Google button, pink result titles, pale-yellow saved results and blue links on My Pages.
  - IBM Plex Sans and Mono replace the system font, and text meets WCAG AA contrast; the result
    titles are a deeper pink for it.
- **Home:**
  - the Bing photo fills the page under a dark radial wash, so the white title reads at 4.5:1 or
    better over the brightest part of the photo behind it.
  - The search box and the Google and Bing buttons sit in one white panel, and My Pages and the
    photo credit are labelled chips.
- **Results:**
  - the header stays at the top while the page scrolls.
  - Its title carries the project icon and lines up with the websites filter below it, its search
    box lines up with the results, and its buttons share one height.
  - Each site in the websites filter is one row with its tick box, its number of results and a bar,
    in place of a tick box beside a separate button.
  - A status line counts the results shown and the sites hidden, results are numbered in one panel,
    and each result's Favourite or Remove button sits in its own column.
  - A saved result also carries a Saved tag.
- **States:** Bing reads unavailable instead of looking like a working button. Hiding every site,
  turning Google off and an empty My Pages each have their own message, and every control shows a
  blue ring when reached with the keyboard.
- **My Pages:** cards show each page's address, title and snippet, and Remove takes a page off the
  list; until now pages could be removed only from the results page.
- **Google button:**
  - on the home page it now switches in place.
  - It used to open the results page, which returned straight to the home page without a query and
    made the page flash.
  - A search made with Google switched off now keeps the Google results hidden; since 2021 a new
    search had shown them anyway.
- **Kept:** the clear button in the search box, which empties the box and the saved query.
- **Code:** the icons are Bootstrap Icons 1.13.1 glyphs, inlined in `src/icons.jsx`;
  `src/address.jsx` sets each address's site in bold. The Google and Bing image icons left `html/`,
  and Bootstrap now loads before the project's stylesheets.
- **Checks:** 20 tests pass, and `npm run build` builds 104 modules. In headless Chromium at 1,280,
  1,440 and 1,920 pixels wide, every page and state matched the design's mockups, the search box
  lined up with the results, nothing scrolled sideways, and there were no console errors or
  warnings.

[Back to change history](#change-history)

<a id="framework-upgrade"></a>

### Framework upgrade — 2026-10-02

- **Frameworks:** React 19.3, React Router 8.4 and Bootstrap 5.3 replace React 17, React Router 5
  and Bootstrap 4, and `src/index.jsx` mounts the app with `createRoot`.
- **Routing:** `react-router-dom` is gone; the app imports from `react-router`. React Router 8 no
  longer passes `match` and `history` to page components, and class components cannot call its
  hooks, so `src/router.jsx` hands each page the current `location` and a `navigate` function. The
  results page returns to the home page through `Navigate`.
- **Styling:**
  - Bootstrap 5 dropped the `close` and `card-columns` styles, pads cards and list items only inside
    `.card` and `.list-group`, underlines links, and resets card heights.
  - The project's stylesheets now carry the Bootstrap 4 values the pages relied on, so they look as
    they did.
  - The small address under each result title takes Bootstrap 5's slightly darker grey.
- **Node.js:** React Router 8 needs Node.js 22.22 or newer, up from 20.19 or 22.12.
- **Dependencies:**
  - `jquery` and `popper.js`, installed only for Bootstrap 4, are gone; Bootstrap 5 brings
    `@popperjs/core`, which the app does not use.
  - An install adds 99 packages, 9 of them for the app itself, and `npm audit` reports no
    vulnerabilities.
  - The built script grew from 170 to 276 kB and the stylesheet from 149 to 236 kB.
- **Checks:**
  - the 14 tests pass with only their router import changed, and `npm run build` builds 102 modules.
  - In headless Chromium at 1,440 by 900 pixels, the home page, the results page, newly saved
    results, My Pages and a filtered list matched screenshots taken before the upgrade apart from
    that grey and font smoothing, with no console errors or warnings.

[Back to change history](#change-history)

<a id="saved-results-first"></a>

### Saved results first — 2026-10-02

- **Results page:** saved results are listed above the others, each group in its original order,
  on a pale yellow background with rounded corners. The 2021 feature list had this as not yet
  implemented.
- **When it changes:** choosing Favourite colours the result at once, and Remove clears it. The
  result moves only when the list is next drawn, after a filter change, a new search, a return from
  My Pages or a reload, so the list never jumps under the pointer.
- **Code:** a `SearchResult` component in `src/searchResults.jsx` draws each result with its
  button, replacing the button-only `FavouriteButton`.
- **Checks:** two new tests cover the colour and the order, and all 14 pass. Headless Chromium
  screenshots showed two newly saved results coloured in place and listed first after a return
  from My Pages, without page errors.

[Back to change history](#change-history)

<a id="automated-tests"></a>

### Automated tests — 2026-10-02

- **Tests:**
  - `npm test` runs Vitest with React Testing Library in a simulated browser page from jsdom.
  - `src/app.test.jsx` opens the app through its router and checks a search from the button and from
    Enter, the result links, the return home without a query, the clear button, both filters, saving
    and removing favourites, My Pages, and what a reload keeps.
- **Isolation:** the app's modules set up local storage and the filter state when they load, so
  each test reloads them and starts like a freshly opened page.
- **Checks:** all 12 tests passed against the app as it stood, on React 17, and `npm run build`
  still succeeded.

[Back to change history](#change-history)

<a id="layout-and-dependency-cleanup"></a>

### Layout and dependency cleanup — 2026-10-01

- **Results header:** the search box on the results page narrows with the window, from its full 700
  pixels down, so the Google and Bing buttons stay in view on a 1,280-pixel window instead of
  running past its edge.
- **My Pages icon:** it is placed from the window's right edge, as the home page's icon is, instead
  of 1,810 pixels from the left, which put it off-screen on any window narrower than about 1,860
  pixels.
- **Website filter:** each tick box sits at the left of its button. It used to stretch across the
  filter column and land on top of the site's name.
- **Dependencies:** `bootstrap-icons`, `web-vitals` and the three testing libraries left
  `package.json`, as did `jquery` and `popper.js`, which npm still installs because Bootstrap 4
  needs them. The app now needs React, React DOM, React Router, React Router DOM, Bootstrap and
  `local-storage`.
- **Checks:**
  - in headless Chromium at 1,280, 1,440 and 1,920 pixels wide, the Bing button and the My Pages
    icon stayed in the window with room between them, no tick box overlapped a site name, and no
    window scrolled sideways.
  - Search, the clear button, favourites, My Pages and both filters behaved as before, without page
    errors, and `npm run build` built 46 modules.

[Back to change history](#change-history)

<a id="vite-build-and-bug-fixes"></a>

### Vite build and the 2021 bug fixes — 2026-10-01

- **Why:** neither version of the app ran on current Node.js. The tip stopped at a module that
  `react-dev-utils` 12 no longer has, and Version 3.31 at a PostCSS package-export error.
- **Build:**
  - Vite 8 and its React plugin replace the ejected Create React App 4 setup.
  - `config/` and `scripts/` are gone; `index.html` moved from `html/` to the project folder and
    loads `src/index.jsx`; `vite.config.js` keeps `html/` as the public folder, port 3000 and the
    `build/` folder.
  - Vite maps Node's `global` to the browser's `globalThis` for the `local-storage` package, as
    webpack used to.
- **Scripts:** `npm start`, `npm run build` and the new `npm run preview`. `npm test` left with the
  2021 Jest setup, which had no tests.
- **Dependencies:**
  - the build, lint and test tooling left `package.json`, and `vite` and `@vitejs/plugin-react` are
    its only development dependencies.
  - An install adds 124 packages instead of about 920, and `package-lock.json`, deleted in 2022,
    pins them again.
  - GitHub's seven open security alerts, six for `webpack-dev-server` and one for `@babel/core`,
    were all in removed packages.
  - The app's own packages are unchanged; nothing imports `jquery`, `popper.js`, `bootstrap-icons`,
    `web-vitals` or the testing libraries, which stay listed.
- **Search:** the development line that set the previous query to `123` is gone. A new query loads
  the six bundled sample results, so every query shows them, including a new search from the
  results page.
- **Clear button:** it empties the search box. It used to reset the form, which put the previous
  query back.
- **Favourite buttons:**
  - each result's button reads the saved pages, so a saved result shows Remove after a return from
    My Pages or a reload, and choosing it again removes the page instead of saving it twice.
  - Saved pages are matched by link, and choosing a button no longer redraws the whole results page.
- **Checks:**
  - `npm run build` builds 46 modules.
  - On the development server in headless Chromium, every query showed six results; the clear button
    emptied the box; favourites survived a return from My Pages and a reload without duplicates;
    unticking a website hid its two results and turning Google off showed the no-results message; no
    page errors.
  - `npm run preview` served the project icon's favicon to the page that links it.
  - Two layout bugs found on the way were added to the known bugs.

[Back to change history](#change-history)

<a id="project-icon"></a>

### Project icon — 2026-10-01

- **Icon:**
  - `Resources/MetaSearchEngineIcon.png` is the 1,024-pixel master: three coloured sources flow into
    one magnifier showing a merged results list, on a light blue tile clipped to the rounded square
    macOS draws for app icons, 824 of 1024 pixels, with a soft shadow that keeps its edge on a white
    background.
  - It sits outside `html/`, so the build does not serve it.
- **Favicon:** `html/favicon.ico`, which `index.html` already loads, was React's default logo from
  the Create React App template. It is now an icon file holding the same artwork at 16, 32, 48, 64,
  128 and 256 pixels.
- **Finder:** the project folder's icon was set from the same master.
- **Checks:**
  - the master is 1,024 by 1,024 pixels with a transparent margin around its 824-pixel tile; the
    favicon's 16, 32 and 64-pixel images were inspected; and the folder icon as macOS reports it
    shows the new artwork.
  - The build stopped at the time, so the favicon was not yet seen in a served page.

[Back to change history](#change-history)

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
- **Unchanged:** the application source and its dependencies, so the build failure that the
  [webpack 5 upgrade record](#webpack-5-upgrade) describes remained.
- **Status:** delivered uncommitted on 2026-10-01, then committed the same day as `a5bb3d1` (the
  import with its history), `54f6df9` and `1cc222a`.

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
- **Sample results:** 3.29 bundled the six sample Google results, with a development line that set
  the previous query to `123` on every render, so only the query `123` showed them.
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
