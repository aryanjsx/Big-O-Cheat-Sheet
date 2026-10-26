"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV, TOPICS_PAGE } from "@/lib/routes";

const KEY_COLORS = ["--c-green", "--c-yg", "--c-yellow", "--c-orange", "--c-red", "--c-dred"];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Close an open menu on an outside click or Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(ev: MouseEvent) {
      if (!navRef.current?.contains(ev.target as Node)) setOpen(null);
    }
    function onKey(ev: KeyboardEvent) {
      if (ev.key === "Escape") {
        setOpen(null);
        navRef.current?.querySelector<HTMLButtonElement>(`[data-group="${open}"]`)?.focus();
      }
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(null);
    setMobileOpen(false);
  };
  const current = (href: string) => (pathname === href || pathname + "/" === href ? "page" : undefined);

  return (
    <header className={"site-header" + (mobileOpen ? " is-open" : "")}>
      <div className="key-strip" aria-hidden="true">
        {KEY_COLORS.map((c) => (
          <span key={c} style={{ background: `var(${c})` }} />
        ))}
      </div>
      <div className="wrap">
        <Link href="/" className="wordmark" onClick={close}>
          Big<em>O</em>Sheet
        </Link>
        <button
          type="button"
          className="btn menu-toggle"
          aria-expanded={mobileOpen}
          aria-controls="site-nav"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? "Close" : "Menu"}
        </button>

        <nav className="nav" id="site-nav" aria-label="Main" ref={navRef}>
          <Link href={TOPICS_PAGE.href} className="nav-link" aria-current={current(TOPICS_PAGE.href)} onClick={close}>
            {TOPICS_PAGE.label}
          </Link>
          {NAV.map((group) => {
            const isOpen = open === group.label;
            const active = group.links.some((l) => current(l.href));
            const menuId = "menu-" + group.label.toLowerCase();
            return (
              <div className="nav-item" key={group.label}>
                <button
                  type="button"
                  className={"nav-trigger" + (active ? " is-active" : "")}
                  data-group={group.label}
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                  onClick={() => setOpen(isOpen ? null : group.label)}
                >
                  {group.label} <span className="caret" aria-hidden="true">▼</span>
                </button>
                <span className="nav-group-label">{group.label}</span>
                <ul className="nav-menu" id={menuId} hidden={!isOpen}>
                  {group.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} aria-current={current(l.href)} onClick={close}>
                        {l.label}
                        <span className="nav-blurb">{l.blurb}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="nav-end">
          <Link href="/revision/" className="btn btn-sm" onClick={close}>
            Revision sheet
          </Link>
        </div>
      </div>
    </header>
  );
}
