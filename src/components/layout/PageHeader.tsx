import Link from "next/link";

interface Props {
  /** The group the page belongs to, such as "Reference". Links back when `eyebrowHref` is set. */
  eyebrow?: string;
  eyebrowHref?: string;
  title: string;
  id?: string;
  lede?: React.ReactNode;
  /** Buttons or links under the lede. */
  actions?: React.ReactNode;
}

export default function PageHeader({ eyebrow, eyebrowHref, title, id, lede, actions }: Props) {
  return (
    <header className="page-header">
      {eyebrow && <p className="eyebrow">{eyebrowHref ? <Link href={eyebrowHref}>{eyebrow}</Link> : eyebrow}</p>}
      <h1 id={id}>{title}</h1>
      {lede && <p className="lede">{lede}</p>}
      {actions && <div className="page-actions">{actions}</div>}
    </header>
  );
}
