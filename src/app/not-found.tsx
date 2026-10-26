import Link from "next/link";

export default function NotFound() {
  return (
    <div className="not-found">
      <p className="eyebrow">404</p>
      <h1>That page isn&apos;t on the sheet</h1>
      <p className="lede">
        The link may be from the old single-page version. Try <Link href="/topics/">all topics</Link> or go back to the{" "}
        <Link href="/">home page</Link>.
      </p>
    </div>
  );
}
