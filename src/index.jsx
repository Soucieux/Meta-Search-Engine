import ReactDOM from "react-dom";
import SearchRouter from "./searchRouter";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <BrowserRouter>
    <SearchRouter />
  </BrowserRouter>,
  document.getElementById("body")
);
