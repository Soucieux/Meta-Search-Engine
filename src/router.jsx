import React from "react";
import Search from "./search";
import Favourite from "./favourite";
import { Route, Routes, useLocation, useNavigate } from "react-router";

/**
 * 渲染一个页面组件，并传入当前地址和跳转函数。页面都是类组件，不能调用 React Router 的 hook，
 * React Router 也不再把它们作为 props 传给路由组件，因此由这个函数组件读取后传入。
 * @param {{component: function(new: React.Component)}} props component 为要渲染的页面组件
 * @returns {React.ReactElement} 带有 location（当前地址）和 navigate（跳转函数）的页面
 */
function RoutePage({ component: Page }) {
  return <Page location={useLocation()} navigate={useNavigate()} />;
}

class Router extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Routes>
          <Route path="/results" element={<RoutePage component={Search} />} />
          <Route path="/" element={<RoutePage component={Search} />} />
          <Route
            path="/favourite"
            element={<RoutePage component={Favourite} />}
          />
        </Routes>
      </div>
    );
  }
}

export default Router;
