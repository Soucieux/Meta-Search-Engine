import ReactDOM from "react-dom";
import SearchRoute from "./searchRoute";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <SearchRoute />
  </BrowserRouter>,
  document.getElementById("body")
);
