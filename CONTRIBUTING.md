# Contributing to Meta Search Engine

Thank you for helping improve Meta Search Engine. This guide covers the project-specific boundaries
that apply in both the canonical workspace and the standalone public repository.

## Start here

- Read the [project README](README.md) for supported behavior, setup, current state, architecture,
  and history.
- Run commands from this project directory with Node.js 20.19 or newer, or 22.12 or newer, and npm,
  after `npm install`.
- Keep each change focused and update the README when capabilities, setup, architecture,
  workflows, or history change.
- Never commit `node_modules`, build output, coverage, logs, `.env` files, credentials, or API keys.

## Product boundaries

- Meta Search Engine is a browser-only single-page app. Its state stays in the browser's local
  storage; there is no server and no other store.
- Never commit a search API key, in the source or in any other tracked file. The keys earlier
  commits carried read `REDACTED`. A key for the commented-out ValueSERP request belongs in an
  ignored `.env.local` file as a `VITE_` variable, which Vite passes to the app as
  `import.meta.env`; any key the browser sends is visible to the people who use it.
- The bundled sample results stand in for live results. Keep them clearly sample data until a real
  search provider replaces them.

## Checks for a change

- Run `npm run build` for any source, dependency, or configuration change; it must finish without
  errors.
- Run `npm start` for interface changes, then check the home page, the results page, and My Pages
  in a browser. A passing build does not establish visual correctness.
- There are no automated tests yet. The 2021 Jest setup left with the old build, so tests need a
  runner that works with Vite, such as Vitest.

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
