import ReactDOM from "react-dom";
import Search from "./search";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <Search />
  </BrowserRouter>,
  document.getElementById("body")
);
