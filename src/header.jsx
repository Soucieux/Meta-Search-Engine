import { Link } from "react-router";
import { PersonCircleIcon } from "./icons";
import { FAVOURITE_PATH, HOME_PATH } from "./routes";

// 应用的名称：主页的标题和页头的标题；index.html 的页面标题和 html/manifest.json 用同一个名称
export const APP_TITLE = "MetaData Search Engine";

/**
 * 结果页和 My Pages 共用的页头：左侧是项目图标和应用名称，右侧是 My Pages 链接，
 * 中间可以放结果页的搜索框和来源按钮。样式在 search.css。
 * @param {{current?: "favourite", children?: React.ReactNode}} props
 *   current 为 "favourite" 时 My Pages 链接标记为当前页；children 为页头中间的内容，
 *   没有时标题和链接分列两端
 * @returns {React.ReactElement} 页头
 */
export function AppHeader({ current, children }) {
  return (
    <header className="app-header">
      <div
        className={
          children ? "app-header__inner" : "app-header__inner app-header__inner--split"
        }
      >
        <Link to={HOME_PATH} className="app-header__title">
          <img src="/logo.png" alt="" className="app-header__logo" />
          {APP_TITLE}
        </Link>
        {children}
        <MyPagesLink className="mypages-link" current={current === "favourite"} />
      </div>
    </header>
  );
}

/**
 * 通往 My Pages 的链接，带人像图标。
 * @param {{className: string, current?: boolean}} props className 为链接的样式类；
 *   current 为 true 时标记为当前页
 * @returns {React.ReactElement} 链接
 */
export function MyPagesLink({ className, current = false }) {
  return (
    <Link to={FAVOURITE_PATH} className={className} aria-current={current ? "page" : undefined}>
      <PersonCircleIcon size={18} />
      My Pages
    </Link>
  );
}
