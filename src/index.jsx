import { createRoot } from "react-dom/client";
import Router from "./router";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("body")).render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);
