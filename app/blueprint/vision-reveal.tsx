"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateVision, type GeneratedVision } from "@/lib/vision-generator";

const SESSION_KEY = "rooted-essence-vision-session-v1";
const SYNTHESIS_KEY = "rooted-essence-vision-synthesis-v1";
const chapterNames = ["The Reflection", "The Purpose", "The Experience", "Beyond the Chair", "The Future Brand", "The Founder Vision", "The Horizon", "The Next Chapter"];

function readVision(): GeneratedVision {
  let answers: Record<string, string> = {};
  let savedThemes: string[] = [];
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "{}") as { answers?: Record<string, string> };
    answers = session.answers ?? {};
    const synthesis = JSON.parse(localStorage.getItem(SYNTHESIS_KEY) ?? "{}") as { themes?: Array<string | { name?: string; label?: string }> };
    savedThemes = (synthesis.themes ?? []).map((theme) => typeof theme === "string" ? theme : theme.name ?? theme.label ?? "").filter(Boolean);
  } catch { /* The generator supplies a grounded fallback vision. */ }
  return generateVision(answers, savedThemes);
}

export function VisionReveal() {
  const [vision, setVision] = useState<GeneratedVision | null>(null);
  const [chapter, setChapter] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const suppressTapUntil = useRef(0);

  useEffect(() => setVision(readVision()), []);

  const move = useCallback((next: number) => {
    if (next < 0 || next >= chapterNames.length) return;
    setDirection(next > chapter ? "forward" : "back");
    setChapter(next);
  }, [chapter]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "PageDown", "Enter", " "].includes(event.key)) { event.preventDefault(); move(chapter + 1); }
      if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) { event.preventDefault(); move(chapter - 1); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [chapter, move]);

  const content = useMemo(() => vision ? [
    <section className="reveal-chapter reflection-chapter" key="reflection">
      <div className="reveal-emblem"><span aria-hidden="true" /><Image src="/rooted-essence-logo.png" alt="Rooted Essence emblem" width={1024} height={1024} priority sizes="(max-width: 640px) 42vw, 230px" /></div>
      <p className="reveal-eyebrow">Your story has been heard.</p>
      <h1>Certain truths appeared again and again.</h1>
      <div className="theme-sequence" aria-label="Themes in your vision">{vision.themes.map((theme, index) => <span key={theme.id} style={{ "--reveal-delay": `${700 + index * 330}ms` } as React.CSSProperties}>{theme.label}</span>)}</div>
    </section>,
    <section className="reveal-chapter purpose-chapter" key="purpose"><p className="reveal-eyebrow">The Purpose</p><blockquote>{vision.purpose}</blockquote><span className="chapter-seal" aria-hidden="true">Purpose</span></section>,
    <section className="reveal-chapter experience-chapter" key="experience"><p className="reveal-eyebrow">The Experience</p><h1>Care should be felt at every moment.</h1><div className="experience-moments">{vision.experience.map((item, index) => <article key={item.moment} style={{ "--reveal-delay": `${300 + index * 170}ms` } as React.CSSProperties}><span>{item.moment}</span><p>{item.statement}</p></article>)}</div></section>,
    <section className="reveal-chapter opportunity-chapter" key="opportunity"><p className="reveal-eyebrow">Beyond the Chair</p><h1>The strongest next chapters are already present in the vision.</h1><div className="opportunity-list">{vision.opportunities.map((item, index) => <article key={item.label} style={{ "--reveal-delay": `${300 + index * 150}ms` } as React.CSSProperties}><span>0{index + 1}</span><div><h2>{item.label}</h2><p>{item.signal}</p></div></article>)}</div></section>,
    <section className="reveal-chapter pillars-chapter" key="pillars"><p className="reveal-eyebrow">The Future Brand</p><h1>Rooted Essence could become known for…</h1><div className="pillar-cloud">{vision.pillars.map((pillar, index) => <article key={pillar.title} style={{ "--reveal-delay": `${260 + index * 130}ms` } as React.CSSProperties}><h2>{pillar.title}</h2><p>{pillar.line}</p></article>)}</div></section>,
    <section className="reveal-chapter founder-chapter" key="founder"><p className="reveal-eyebrow">The Founder Vision</p><blockquote>{vision.founderVision}</blockquote><div className="founder-signature">Jessica <span>Founder, Rooted Essence</span></div></section>,
    <section className="reveal-chapter horizon-chapter" key="horizon"><p className="reveal-eyebrow">The Horizon</p><h1>This is what Rooted Essence could become.</h1><p>Not overnight. Not by accident.<br />But through clarity, care, and disciplined growth.</p><div className="horizon-line" aria-hidden="true"><span /></div></section>,
    <section className="reveal-chapter final-reveal-chapter" key="final"><p className="reveal-eyebrow">Your vision has a direction now.</p><h1>The next step is turning possibility into a clear path.</h1><Link href="/strategy" className="vision-cta reveal-strategy-cta"><span>See the Strategic Blueprint</span><span className="cta-arrow" aria-hidden="true">→</span></Link><p className="reveal-note">Built from your Rooted Essence Vision Session</p></section>,
  ] : [], [vision]);

  if (!vision) return <main className="reveal-shell reveal-loading" aria-label="Preparing your vision"><div className="root-pulse" /></main>;

  return (
    <main className="reveal-shell" onClick={(event) => { if (Date.now() < suppressTapUntil.current || (event.target as HTMLElement).closest("a, button") || window.getSelection()?.toString()) return; move(chapter + 1); }} onTouchStart={(event) => { const touch = event.touches[0]; touchStart.current = { x: touch.clientX, y: touch.clientY }; }} onTouchEnd={(event) => { if (!touchStart.current) return; const touch = event.changedTouches[0]; const dx = touch.clientX - touchStart.current.x; const dy = touch.clientY - touchStart.current.y; if (Math.max(Math.abs(dx), Math.abs(dy)) > 45) { suppressTapUntil.current = Date.now() + 500; move(chapter + (Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 1 : -1) : (dy < 0 ? 1 : -1))); } touchStart.current = null; }}>
      <div className="reveal-atmosphere" aria-hidden="true"><i /><i /><i /><b /><b /><b /><span /><span /><span /></div>
      <header className="reveal-progress"><div><span>Rooted Essence Vision Reveal</span><strong>{chapterNames[chapter]}</strong></div><p>{String(chapter + 1).padStart(2,"0")} <span>/ {String(chapterNames.length).padStart(2,"0")}</span></p><div className="reveal-progress-line"><span style={{ width: `${((chapter + 1) / chapterNames.length) * 100}%` }} /></div></header>
      <div className={`reveal-stage reveal-${direction}`} key={chapter}>{content[chapter]}</div>
      <footer className="reveal-controls"><button type="button" onClick={() => move(chapter - 1)} disabled={chapter === 0} aria-label="Previous chapter">← <span>Back</span></button><p>Tap or swipe to continue</p><button type="button" onClick={() => move(chapter + 1)} disabled={chapter === chapterNames.length - 1} aria-label="Next chapter"><span>Continue</span> →</button></footer>
    </main>
  );
}
