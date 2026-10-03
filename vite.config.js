import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { liveSearch } from "./scripts/liveSearch.js";

// html/ keeps the static files it held under the 2021 Create React App setup,
// and the app keeps its port and its build folder. Vitest runs the tests in a simulated
// browser page, which supplies local storage.
// The servers answer /live/search with the Tavily key from .env.local; loadEnv reads the
// unprefixed TAVILY_API_KEY here, and only VITE_ variables ever reach the page.
export default defineConfig(({ mode }) => ({
  plugins: [react(), liveSearch(loadEnv(mode, process.cwd(), "").TAVILY_API_KEY)],
  publicDir: "html",
  server: { port: 3000 },
  preview: { port: 3000 },
  build: { outDir: "build" },
  test: { environment: "jsdom" },
}));
