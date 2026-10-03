import { Route, Routes, useLocation, useNavigate } from "react-router";
import { Home, ResultsPage } from "./search";
import Favourite from "./favourite";
import { FAVOURITE_PATH, HOME_PATH, RESULTS_PATH } from "./routes";

/**
 * 渲染一个页面组件，并传入当前地址和跳转函数。页面都是类组件，不能调用 React Router 的 hook，
 * React Router 也不再把它们作为 props 传给路由组件，因此由这个函数组件读取后传入。
 * @param {{component: function(new: React.Component)}} props component 为要渲染的页面组件
 * @returns {React.ReactElement} 带有 location（当前地址）和 navigate（跳转函数）的页面
 */
function RoutePage({ component: Page }) {
  return <Page location={useLocation()} navigate={useNavigate()} />;
}

/**
 * 应用的路由：主页，结果页和 My Pages。
 * @returns {React.ReactElement} 路由
 */
export default function Router() {
  return (
    <Routes>
      <Route path={HOME_PATH} element={<RoutePage component={Home} />} />
      <Route path={RESULTS_PATH} element={<RoutePage component={ResultsPage} />} />
      <Route path={FAVOURITE_PATH} element={<RoutePage component={Favourite} />} />
    </Routes>
  );
}
