# Meta Search Engine changelog

Every change to Meta Search Engine, newest first, in one shape: the summary from the history table, then what changed, what was checked and how it was delivered. The README's Change history table lists the newest 10 and links here.

<a id="three-quick-links"></a>

## Three quick links — 2026-10-06

- **Layout:** The line of section links under the title now holds three quick links, Quick start, Architecture and Change history, in place of one for every section; the outline of the whole README is the one GitHub, Obsidian and Project Control provide.

### Changed

- **Why:** the line had grown to as many as fourteen links, drew the eye without saying where each led, and duplicated the outline every reader already has.
- **Line:** `Quick start · Architecture · Change history`, the same three in every project README: get going, see how it is built, see what changed.
- **Scope:** Documentation only.

<a id="readme-source-audit"></a>

## README checked against the source — 2026-10-06

- **Audit:** The structure table lists the contributor guide and the changelog, the two root documents it lacked.

### Changed

- **Why:** a check of the README against the folder found every source path listed and the two root documents missing.
- **Structure:** `CONTRIBUTING.md` and `CHANGELOG.md` join the table; everything else was found accurate.
- **Scope:** Documentation only.

<a id="changelog"></a>

## Documentation — 2026-10-06

- **History:** The complete change history now lives in `CHANGELOG.md`, one entry per change with its summary, what changed, what was checked and how it was delivered; the README table keeps the newest ten rows and opens each entry from its Details cell.

### Changed

- **Why:** the README carried every record's details in one collapsed block, so a reader opened the table and then searched the block, and the details had no fixed shape.
- **Changelog:** `CHANGELOG.md` holds every record this project ever kept, newest first. An entry is its anchor, a dated heading, its summary bullets, then only the subsections it needs: Added, Changed, Fixed, Removed, Checked, Delivered.
- **Migration:** each earlier record's labelled bullets sit under Changed, its evidence under Checked and its status under Delivered; a record over the block limit became a lead with sub-points. Every statement was carried over; none was shortened.
- **README:** the Change history table keeps the newest ten rows, each Details cell opening its entry; the details block and the earlier-history list are gone, and every link into a record now reaches the changelog.
- **Scope:** Documentation only.

<a id="readme-alignment"></a>

## README aligned with the other projects — 2026-10-05

- **Alignment:** The badge row now opens with the platform and names the history mode; the JavaScript badge went, as the Architecture table names the language.

### Changed

- **Why:** every project README shares one structure; this one still lacked part of it.
- **Badges:** Platform, React, History, Routing, Styling and Status; the Language badge went, as the Architecture table names JavaScript.
- **Unchanged:** every sentence inside the sections that stayed; links to a moved part were updated.
- **Scope:** Documentation only.

<a id="readme-skeleton"></a>

## README sections in the shared order — 2026-10-05

- **Structure:** Sections follow the order and names every project README now shares, under a contents line; sections were renamed and moved, and no wording was removed.

### Changed

- **Why:** project READMEs named and ordered the same kinds of section differently, so setup, workflow and
  architecture sat in a different place in each.
- **Order:** the sections now run Overview, Capabilities, Quick start, Workflow, Architecture, Project structure, Contributing, Change history.
- **Renamed:** Features is now Capabilities, and Project map is Project structure.
- **Moved:** Current state now sits under Capabilities.
- **Opening:** a contents line under the title links every section.
- **Unchanged:** every sentence, table, diagram and Project Control marker inside the sections; whole sections
  moved, and links to a renamed section were updated.
- **Scope:** Documentation only.

<a id="readme-structure"></a>

## README laid out as short points — 2026-10-05

- **Readability:** Long paragraphs, bullets and table cells are now short leads with sub-points, one fact each; no detail was removed.

### Changed

- **Why:** many records and some guidance ran as bullets or paragraphs of 50 to 100 words, which hid
  the separate facts inside them.
- **Layout:** every paragraph, bullet and table cell over 50 words is now a short lead with
  sub-points, one fact each. The wording was moved, not rewritten.
- **Unchanged:** every section, heading, link, anchor, table row, diagram, number and identifier.
- **Scope:** Documentation only; no source or dependency changed.

### Checked

- **Evidence:** compared with the previous version, no word is removed, and the headings, anchors,
  links, code spans, numbers and fenced samples are identical. The README layout, link and history
  checks pass.

<a id="source-simplification"></a>

## Simpler source, truer links — 2026-10-02

- **Name:** The app is MetaData Search Engine on the page, in the browser tab and in the web app manifest.
- **Links:** Results and saved pages open at their own address, https included; bold search words now work in accented and Chinese text.
- **Filters:** Ticking a website or switching Web no longer adds a browser history entry, switching Web on the home page keeps the typed query, the Web switch keeps its setting across a reload, and submitting the same query again searches again.
- **Lighter:** Only Bootstrap's base styles load, the IBM Plex fonts ship with the app instead of coming from Google Fonts, and the page's debug logging is gone.

### Changed

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

### Checked

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

<a id="header-title"></a>

## Header title — 2026-10-02

- **Header:** The page title and its icon are larger, as tall as the search box and buttons beside them.

### Changed

- **Header:** on the results page and My Pages, the project icon and "Custom Search" match the
  search box and the header's buttons in size: the icon is as tall as they are, 40 pixels, with the
  same top and bottom edges, and the 24-pixel text sits on their centre line.

### Checked

- **Checks:** in headless Chromium at 1,280 and 1,440 pixels wide, the icon, the search box, the
  Search, Web and My Pages buttons all measured from 12 to 52 pixels down the page, and the middle
  of the title's letters measured 32 pixels, the centre of that band.

<a id="live-web-search"></a>

## Live web search — 2026-10-02

- **Search:** Queries now search the live web through Tavily's free search service, ten results at a time.
- **Key:** Your Tavily key stays with the local development server; the page never receives it.
- **Sources:** Web is the switchable source; Google and Bing show as unavailable.

### Changed

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

### Checked

- **Checks:**
  - 45 tests pass, and `npm run build` builds 105 modules with no trace of the key, which the build
    was given.
  - On the development server, a search with no key showed how to add one, a made-up key came back
    from Tavily as refused, and a request marked as coming from another website was turned away.
  - With a real key, a search for “best pizza in ottawa” listed Tavily's 9 live results in their
    order in headless Chromium at 1,280 and 1,440 pixels wide, with no sideways scrolling and no
    console errors.
  - `.env.local` is ignored by Git and has never been committed.

<a id="interface-refresh"></a>

## Interface refresh — 2026-10-02

- **Look:** A refreshed interface keeps the three pages and their colours, with IBM Plex type and complete hover, focus and empty states.
- **Home:** The Bing photo sits under a soft dark wash, with the search box and sources in one white panel.
- **My Pages:** Cards show each page's address and snippet, and Remove takes a page off the list.

### Changed

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

### Checked

- **Checks:** 20 tests pass, and `npm run build` builds 104 modules. In headless Chromium at 1,280,
  1,440 and 1,920 pixels wide, every page and state matched the design's mockups, the search box
  lined up with the results, nothing scrolled sideways, and there were no console errors or
  warnings.

<a id="framework-upgrade"></a>

## Framework upgrade — 2026-10-02

- **Frameworks:** React 19, React Router 8 and Bootstrap 5 replace React 17, React Router 5 and Bootstrap 4, and the pages look as they did.
- **Node.js:** The app needs Node.js 22.22 or newer.
- **Dependencies:** `react-router-dom`, `jquery` and `popper.js` are no longer installed.

### Changed

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

### Checked

- **Checks:**
  - the 14 tests pass with only their router import changed, and `npm run build` builds 102 modules.
  - In headless Chromium at 1,440 by 900 pixels, the home page, the results page, newly saved
    results, My Pages and a filtered list matched screenshots taken before the upgrade apart from
    that grey and font smoothing, with no console errors or warnings.

<a id="saved-results-first"></a>

## Saved results first — 2026-10-02

- **Saved results:** The results page lists saved results first, on a pale yellow background, one of the 2021 features not yet built.

### Changed

- **Results page:** saved results are listed above the others, each group in its original order,
  on a pale yellow background with rounded corners. The 2021 feature list had this as not yet
  implemented.
- **When it changes:** choosing Favourite colours the result at once, and Remove clears it. The
  result moves only when the list is next drawn, after a filter change, a new search, a return from
  My Pages or a reload, so the list never jumps under the pointer.
- **Code:** a `SearchResult` component in `src/searchResults.jsx` draws each result with its
  button, replacing the button-only `FavouriteButton`.

### Checked

- **Checks:** two new tests cover the colour and the order, and all 14 pass. Headless Chromium
  screenshots showed two newly saved results coloured in place and listed first after a return
  from My Pages, without page errors.

<a id="automated-tests"></a>

## Automated tests — 2026-10-02

- **Tests:** `npm test` runs Vitest tests that drive the app in a simulated browser: search, the clear button, both filters, favourites, My Pages and a reload.

### Changed

- **Isolation:** the app's modules set up local storage and the filter state when they load, so
  each test reloads them and starts like a freshly opened page.

### Checked

- **Tests:**
  - `npm test` runs Vitest with React Testing Library in a simulated browser page from jsdom.
  - `src/app.test.jsx` opens the app through its router and checks a search from the button and from
    Enter, the result links, the return home without a query, the clear button, both filters, saving
    and removing favourites, My Pages, and what a reload keeps.
- **Checks:** all 12 tests passed against the app as it stood, on React 17, and `npm run build`
  still succeeded.

<a id="layout-and-dependency-cleanup"></a>

## Layout and dependency cleanup — 2026-10-01

- **Layout:** The results header and the My Pages icon fit windows from 1,280 pixels wide, and each website filter's tick box sits beside the site's name.
- **Dependencies:** Seven packages nothing imported left `package.json`; the app needs six.

### Changed

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

### Checked

- **Checks:**
  - in headless Chromium at 1,280, 1,440 and 1,920 pixels wide, the Bing button and the My Pages
    icon stayed in the window with room between them, no tick box overlapped a site name, and no
    window scrolled sideways.
  - Search, the clear button, favourites, My Pages and both filters behaved as before, without page
    errors, and `npm run build` built 46 modules.

<a id="vite-build-and-bug-fixes"></a>

## Vite build and the 2021 bug fixes — 2026-10-01

- **Build:** Vite replaces the ejected Create React App setup, so `npm start` and `npm run build` work again on current Node.js.
- **Search:** Every query shows the bundled sample results, not only `123`.
- **Bugs:** The clear button empties the search box, and favourite buttons remember saved pages without saving one twice.
- **Dependencies:** An install adds 124 packages instead of about 920, and the security alerts were all in removed build tools.

### Changed

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

### Checked

- **Checks:**
  - `npm run build` builds 46 modules.
  - On the development server in headless Chromium, every query showed six results; the clear button
    emptied the box; favourites survived a return from My Pages and a reload without duplicates;
    unticking a website hid its two results and turning Google off showed the no-results message; no
    page errors.
  - `npm run preview` served the project icon's favicon to the page that links it.
  - Two layout bugs found on the way were added to the known bugs.

<a id="project-icon"></a>

## Project icon — 2026-10-01

- **Icon:** Added the project icon, three sources flowing into one magnifier on a light blue tile, in the macOS icon shape; its 1,024-pixel master lives in `Resources/`.
- **Browser:** The favicon, until now React's default logo, is a multi-size copy of the same icon.
- **Finder:** The project folder's icon is set from the same master.

### Changed

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

### Checked

- **Checks:**
  - the master is 1,024 by 1,024 pixels with a transparent margin around its 824-pixel tile; the
    favicon's 16, 32 and 64-pixel images were inspected; and the folder icon as macOS reports it
    shows the new artwork.
  - The build stopped at the time, so the favicon was not yet seen in a served page.

<a id="history-cleanup"></a>

## History cleanup and contribution guide — 2026-10-01

- **Dependencies:** `node_modules` is gone from every commit and ignored, so dependencies come from `npm install`.
- **Credentials:** The three API keys earlier commits carried read `REDACTED` in every commit.
- **Authorship:** Commits that named a personal email address now name the author's GitHub noreply address.
- **Documentation:** This README gained the current state, setup, architecture, workflow and change history, and a contribution guide was added.

### Changed

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

### Delivered

- **Status:** delivered uncommitted on 2026-10-01, then committed the same day as `a5bb3d1` (the
  import with its history), `54f6df9` and `1cc222a`.

<a id="semver-update"></a>

## semver security update — 2026-10-01

- **Dependency:** `package.json` requires `semver` 7.5.2 instead of 7.3.2, a Dependabot security update.

### Changed

- **Dependency:** `package.json` requires `semver` 7.5.2 instead of 7.3.2. Dependabot opened the
  update as pull request #8 on 2025-12-03, and it was merged on 2026-10-01.

<a id="dependency-security-updates"></a>

## Dependabot security updates — 2022-02-28 to 2022-09-11

- **Security updates:** Dependabot updated url-parse, node-forge, minimist, async, eventsource and terser.
- **Lock file:** `package-lock.json` was removed, so installs resolve the ranges in `package.json`.

### Changed

- **Merged:** url-parse 1.5.10 (pull request #1, 2022-02-28) and async 2.6.4 (#4, 2022-05-19);
  node-forge 1.3.0, minimist 1.2.6, eventsource 1.1.1 and terser 4.8.1 (#2, #3, #5 and #6, all on
  2022-09-11). Only node-forge changed `package.json`; the others changed the lock file.
- **Closed:** pull request #7, which updated ejs and workbox-webpack-plugin, was closed without
  merging.
- **Lock file:** `package-lock.json` was deleted on 2022-09-11, so installs resolve the version
  ranges in `package.json`.

<a id="webpack-5-upgrade"></a>

## Dependency upgrade to webpack 5 — 2022-02-15

- **Build dependencies:** Moved to webpack 5, webpack-dev-server 4 and `react-dev-utils` 12.
- **Effect:** The webpack configuration was not updated to match, so the app has not built since.

### Changed

- **Change:** the "Upgrade modular" commit and two "Update node-modules" commits moved the build
  dependencies to webpack 5.69, webpack-dev-server 4.7, `react-dev-utils` 12, css-loader 6,
  postcss-loader 6, postcss-preset-env 7 and `@svgr/webpack` 6, added node-forge, and refreshed the
  committed `node_modules`.
- **Effect:** the webpack configuration in `config/` still came from Create React App 4 and requires
  `react-dev-utils/WatchMissingNodeModulesPlugin`, which `react-dev-utils` 12 does not include. Since
  this change, `npm start` and `npm run build` stop at that missing module.

<a id="favourite-pages"></a>

## Favourite pages, Versions 3.0 to 3.31 — 2021-03-09 to 2021-04-07

- **Favourites:** Versions 3.0 to 3.31 added saving results and the My Pages collection.
- **Websites filter:** The filter remembers its state in the browser and lost a run of bugs.
- **Sample results:** Six bundled Google results replaced the live request.

### Changed

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

<a id="search-results-and-filters"></a>

## Search results and filters, Versions 2.0 to 2.22 — 2021-02-22 to 2021-03-08

- **Search results:** Versions 2.0 to 2.22 added the results page.
- **Filters:** A websites filter and a Google search-engine filter narrow the results.
- **Home page:** A full-page image and a return to it when no query is set.

### Changed

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

<a id="search-bar"></a>

## Search bar, Versions 1.0 to 1.10 — 2021-02-20 to 2021-02-22

- **Search bar:** Versions 1.0 to 1.10 built the search box, its submit and clear buttons, and the route to the results page.

### Changed

- **Patch notes:** "Version 1.0 ~ 1.10", February 20, 2021 ~ February 22, 2021: the search bar.
- **Search box:** 1.0 added the search input and button, 1.1 aligned them, and 1.2 added a button
  that clears the input.
- **Structure:** 1.3 to 1.5 split the code into components and moved the page shell and its assets
  into `html/`; 1.6 fixed navigation to the results page.
- **Search bar and results:** 1.7 and 1.8 merged the search bar and the results, 1.9 added comments
  and the first live ValueSERP request, and 1.10 separated the two again behind a router.

<a id="first-prototypes"></a>

## First prototypes — 2020-12-09 to 2021-02-19

- **Beginnings:** A static page template, a Node.js server with a Google Custom Search trial, and then the React app with Bootstrap.

### Changed

- **Static page:** on 2020-12-09 the repository began with a single-page HTML template, its
  stylesheet and images, and a README.
- **Node.js server:** on 2021-02-05 a small Node.js server replaced the template, serving
  `main/main.html` with a commented-out Google Custom Search sample and the `googleapis` package.
- **React app:** on 2021-02-18 and 2021-02-19 the project moved to a React app from the Create
  React App template, ejected into `config/` and `scripts/`, and V 0.2.1 added Bootstrap.
