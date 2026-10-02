// Bootstrap 先于各页面的样式载入，页面样式中的设计变量和焦点样式才能覆盖它
import "bootstrap/dist/css/bootstrap.css";
import { createRoot } from "react-dom/client";
import Router from "./router";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("body")).render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);
