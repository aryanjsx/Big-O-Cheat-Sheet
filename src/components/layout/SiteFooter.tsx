"use client";

import Link from "next/link";
import { useProgress } from "@/context/ProgressContext";
import { useSheet } from "@/context/SheetContext";
import { GITHUB_URL, NAV, TOPICS_PAGE } from "@/lib/routes";
import { asset } from "@/lib/utils";

export default function SiteFooter() {
  const { setShortcutsOpen } = useSheet();
  const { persistent } = useProgress();
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-about">
          <Link href="/" className="wordmark">
            Big<em>O</em>Sheet
          </Link>
          <p>A Big O reference for interview prep. Every bound says which case it is and what it assumes.</p>
          <p>
            <a href={asset("/Big-O-Sheet.pdf")} download>
              Full PDF
            </a>
            {" · "}
            <a href={asset("/Big-O-Sheet-one-page.pdf")} download>
              One-page PDF
            </a>
          </p>
        </div>
        {NAV.map((group) => (
          <div className="footer-col" key={group.label}>
            <h2>{group.label}</h2>
            <ul>
              {group.label === "Reference" && (
                <li>
                  <Link href={TOPICS_PAGE.href}>All topics</Link>
                </li>
              )}
              {group.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="wrap footer-bottom">
        <span>
          Made by <a href="https://github.com/aryanjsx">Aryan Kumar</a>. MIT license.{" "}
          <a href={GITHUB_URL}>Source and corrections on GitHub</a>.
        </span>
        <span>
          {persistent ? "Progress stays in this browser." : "Progress is not being saved in this browser."}{" "}
          <button type="button" className="linklike" onClick={() => setShortcutsOpen(true)}>
            Keyboard shortcuts
          </button>{" "}
          <kbd>?</kbd>
        </span>
      </div>
    </footer>
  );
}
