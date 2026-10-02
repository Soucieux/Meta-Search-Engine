import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// html/ keeps the static files it held under the 2021 Create React App setup,
// and the app keeps its port and its build folder. The local-storage package reads
// Node's `global`, which webpack used to supply in the browser.
export default defineConfig({
  plugins: [react()],
  define: { global: "globalThis" },
  publicDir: "html",
  server: { port: 3000 },
  preview: { port: 3000 },
  build: { outDir: "build" },
});
