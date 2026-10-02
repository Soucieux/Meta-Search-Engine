/**
 * 搜索结果的显示链接：网站名加粗，其后的路径照原样显示。
 * @param {{displayedLink: string}} props displayedLink 为搜索结果的 displayed_link，
 *   例如 "www.mcdonalds.com › en-ca"
 * @returns {React.ReactElement} 网站名（<b>）及其后的路径
 */
export default function Address({ displayedLink }) {
  let pathStart = displayedLink.indexOf(" › ");
  if (pathStart === -1) {
    return <b>{displayedLink}</b>;
  }
  return (
    <>
      <b>{displayedLink.slice(0, pathStart)}</b>
      {displayedLink.slice(pathStart)}
    </>
  );
}
