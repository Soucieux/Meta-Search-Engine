/**
 * 搜索结果的显示地址：网站名加粗，其后的路径照原样显示。样式在 search.css（.address）。
 * @param {{result: {domain: string, displayed_link: string}}} props result 为搜索结果或已收藏的网页；
 *   displayed_link 以 domain 开头，例如 "www.example.com › news › local"
 * @returns {React.ReactElement} 网站名（<b>）及其后的路径
 */
export default function Address({ result }) {
  return (
    <span className="address">
      <b>{result.domain}</b>
      {result.displayed_link.slice(result.domain.length)}
    </span>
  );
}
