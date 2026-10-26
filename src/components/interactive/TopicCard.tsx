"use client";

import { useState } from "react";
import CopyButton from "@/components/ui/CopyButton";
import LangTabs, { type LangTab } from "@/components/ui/LangTabs";
import { useProgress } from "@/context/ProgressContext";
import { useSheet } from "@/context/SheetContext";
import { COMPARE } from "@/data/compare";
import { MULTILANG } from "@/data/multilang";
import type { CodeLang, Entry } from "@/data/types";
import { shareUrl } from "@/lib/utils";

const LANGS: LangTab<CodeLang>[] = [
  { key: "python", label: "Python" },
  { key: "java", label: "Java" },
  { key: "cpp", label: "C++" },
  { key: "javascript", label: "JavaScript" },
];

function PressButton({ label, pressed, aria, onClick }: { label: string; pressed: boolean; aria: string; onClick(): void }) {
  return (
    <button type="button" className="btn btn-sm" aria-pressed={pressed} aria-label={aria} onClick={onClick}>
      {label}
    </button>
  );
}

export default function TopicCard({ e, isTarget }: { e: Entry; isTarget: boolean }) {
  const progress = useProgress();
  const { announce, pickCompare } = useSheet();
  const [lang, setLang] = useState<CodeLang>("python");
  const saved = progress.isSaved(e.id);
  const learned = progress.isLearned(e.id);

  const variants = MULTILANG[e.id];
  const tabs = variants ? LANGS.filter((l) => l.key === "python" || variants[l.key as Exclude<CodeLang, "python">]) : null;
  const variant = lang === "python" || !variants ? null : variants[lang];
  const code = variant ? variant.code : e.code;
  const langLabel = LANGS.find((l) => l.key === lang)!.label;

  const cls = ["card", learned && "is-learned", isTarget && "is-target"].filter(Boolean).join(" ");

  return (
    <article className={cls} id={"card-" + e.id} tabIndex={isTarget ? -1 : undefined}>
      <h3>{e.name}</h3>
      <div className="badges">
        <span className="badge">{e.topic}</span>
        <span className={"badge " + e.rel.toLowerCase()}>{e.rel} interview relevance</span>
      </div>
      <div className="card-actions" role="group" aria-label={"Actions for " + e.name}>
        <PressButton
          label="Save"
          pressed={saved}
          aria={"Save " + e.name}
          onClick={() => announce(e.name + (progress.toggleSaved(e.id) ? " saved" : " removed from saved"))}
        />
        <PressButton
          label="Mark learned"
          pressed={learned}
          aria={"Mark " + e.name + " as learned"}
          onClick={() =>
            announce(e.name + (progress.toggleLearned(e.id) ? " marked as learned" : " marked as not learned"))
          }
        />
        <CopyButton
          className="btn btn-sm"
          label="Copy link"
          okLabel="Link copied"
          aria-label={"Copy link to " + e.name}
          text={() => shareUrl("algo=" + e.id)}
        />
        {COMPARE[e.id] && (
          <button
            type="button"
            className="btn btn-sm"
            aria-label={"Compare " + e.name + " with another topic"}
            onClick={() => pickCompare(e.id)}
          >
            Compare
          </button>
        )}
      </div>
      <dl className="facts">
        <dt>Time</dt>
        <dd>{e.time}</dd>
        <dt>Space</dt>
        <dd>{e.space}</dd>
      </dl>
      <p>
        <strong>When to use: </strong>
        {e.when}
      </p>

      <details onToggle={(ev) => (ev.currentTarget as HTMLDetailsElement).open && progress.setLast(e.id)}>
        <summary>Why, code, and pitfalls</summary>
        <h4>Why it costs this much</h4>
        <p>{e.why}</p>
        {tabs && <LangTabs<CodeLang> tabs={tabs} selected={lang} onSelect={setLang} aria-label={"Language for " + e.name} />}
        <div className="code-wrap">
          <pre tabIndex={tabs ? 0 : undefined}>
            <code>{code}</code>
          </pre>
          <CopyButton
            className="btn copy-btn"
            label="Copy"
            text={code}
            aria-label={tabs ? `Copy ${langLabel} code for ${e.name}` : "Copy code for " + e.name}
          />
        </div>
        {tabs && (
          <p className="lang-note">
            {variant ? langLabel + ": " + variant.cost : "Baseline example used throughout this sheet."}
          </p>
        )}
        <h4>Common pitfalls</h4>
        <p>{e.pitfall}</p>
        <div className="links">
          {e.ref && (
            <a href={e.ref} rel="noopener">
              Reference
            </a>
          )}
          <a href={"#" + e.section}>See it in the tables</a>
        </div>
      </details>
    </article>
  );
}
