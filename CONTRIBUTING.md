# Contributing to Meta Search Engine

Thank you for helping improve Meta Search Engine. This guide covers the project-specific boundaries
that apply in both the canonical workspace and the standalone public repository.

## Start here

- Read the [project README](README.md) for supported behavior, setup, current state, architecture,
  and history.
- Run commands from this project directory with Node.js 22.22 or newer and npm, after
  `npm install`.
- Keep each change focused and update the README when capabilities, setup, architecture,
  workflows, or history change.
- Never commit `node_modules`, build output, coverage, logs, `.env` files, credentials, or API keys.

## Product boundaries

- Meta Search Engine is a single-page app whose state stays in the browser's local storage. Queries
  go to one hosted service, Tavily, and only through the development or preview server's
  `/live/search` address; send nothing else to a hosted service.
- Never commit a search API key, in the source or in any other tracked file. The keys earlier
  commits carried read `REDACTED`. The Tavily key belongs in the ignored `.env.local` file as
  `TAVILY_API_KEY`, without the `VITE_` prefix, so only the server reads it. Never give the page a
  key: Vite passes every `VITE_` variable to the browser, where the people who use it can read it.
- Keep `/live/search` answering only the app's own page, and pass the page nothing from Tavily but
  each result's title, address and excerpt.
- The page itself loads nothing from a third party: the fonts ship with the app, and Bootstrap's
  base styles come from the package. Do not add a link to a hosted stylesheet, script or font.

## Checks for a change

- Run `npm test` and `npm run build` for any source, dependency, or configuration change; both
  must finish without errors.
- Add or update a test in `src/app.test.jsx` when behavior changes. The tests drive the app through
  its router in a simulated browser page, as a user would, against a stand-in for Tavily;
  `scripts/liveSearch.test.js` covers the live search's answers and refusals, and
  `src/webSearch.test.js` the results' fields, snippets and bold search words.
- Name a local-storage key in `src/storage.js` and read or write it through that module's
  functions; never write the key string or call `localStorage` in a component.
- Run `npm start` for interface changes, then check the home page, the results page, and My Pages
  in a browser. Passing tests and a build do not establish visual correctness.

<a id="version-and-build-policy"></a>

## Version and build policy

Meta Search Engine uses dated project history and does not assign a project-level version or build
number.

- Record meaningful changes under their actual date without inventing a release number.
- The 2021 labels, from V 0.2.1 to Version 3.31, are historical development counters, not project
  versions; do not continue them.
- A dependency, API, or Git commit version is not a Meta Search Engine project version.
- Keep implementation, tests, builds, deployment, and publication as separate evidence states.
- Do not describe uncommitted work or a prepared export as published.

The canonical workspace also applies its root repository instructions and internal procedures.
Those private files remain authoritative there; this standalone guide supplies the project-facing
rules that travel with the exported subtree.
