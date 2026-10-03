// Bootstrap 的基础样式（reboot）先于各页面的样式载入，页面样式中的设计变量和焦点样式才能覆盖它；
// 应用只用到它的基础样式和 visually-hidden（在 search.css 中），不载入完整的 Bootstrap
import "bootstrap/dist/css/bootstrap-reboot.css";
// IBM Plex Sans 和 Mono 随应用一起发布（@fontsource 的拉丁字符子集），不从 Google Fonts 载入；
// 页面用到的字重：Sans 400、500、600、700，Mono 400、500
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-sans/latin-700.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import { createRoot } from "react-dom/client";
import Router from "./router";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("body")).render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);
