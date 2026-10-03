/**
 * 没有可显示内容时的说明：图标、标题和一句话，可带一个动作链接。样式在 search.css（.empty），
 * 页面可以通过 className 加上自己的变体（favourite.css 中的 .saved-empty）。
 * @param {{icon: React.ReactElement, heading: string, body: string, level?: 2 | 3, className?: string, children?: React.ReactNode}} props
 *   icon 为图标元素；heading 和 body 为标题和说明；level 为标题的层级（默认 3，按页面的标题结构）；
 *   className 为附加的样式类；children 为说明下方的动作，例如一个链接
 * @returns {React.ReactElement} 说明
 */
export default function EmptyState({ icon, heading, body, level = 3, className, children }) {
  let Heading = `h${level}`;
  return (
    <div className={className ? `empty ${className}` : "empty"}>
      <span className="empty__icon" aria-hidden="true">
        {icon}
      </span>
      <Heading className="empty__heading">{heading}</Heading>
      <p className="empty__body">{body}</p>
      {children}
    </div>
  );
}
