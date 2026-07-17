"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { visionQuestions } from "./questions";
import { detectVisionThemes } from "@/lib/vision-generator";

const STORAGE_KEY = "rooted-essence-vision-session-v1";
const SYNTHESIS_KEY = "rooted-essence-vision-synthesis-v1";
type SavedSession = { currentIndex: number; answers: Record<string, string> };
const synthesisMessages = ["Listening to the heart behind your work", "Connecting the patterns in your vision", "Uncovering what Rooted Essence could become", "Building your founder blueprint"];

function restoreSession(): SavedSession {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { currentIndex: 0, answers: {} };
    const saved = JSON.parse(raw) as Partial<SavedSession>;
    return {
      currentIndex: Math.min(Math.max(Number.isInteger(saved.currentIndex) ? saved.currentIndex! : 0, 0), visionQuestions.length),
      answers: saved.answers && typeof saved.answers === "object" ? saved.answers : {},
    };
  } catch {
    return { currentIndex: 0, answers: {} };
  }
}

export function VisionSession() {
  const [session, setSession] = useState<SavedSession>({ currentIndex: 0, answers: {} });
  const [restored, setRestored] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [synthesisStep, setSynthesisStep] = useState(0);
  const [synthesisReady, setSynthesisReady] = useState(false);

  useEffect(() => { setSession(restoreSession()); setRestored(true); }, []);
  useEffect(() => {
    if (restored) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }, [session, restored]);
  const detectedThemes = useMemo(() => detectVisionThemes(session.answers), [session.answers]);
  useEffect(() => {
    if (!restored || session.currentIndex < visionQuestions.length) return;
    localStorage.setItem(SYNTHESIS_KEY, JSON.stringify({ themes: detectedThemes.map((theme) => theme.label) }));
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setSynthesisStep(synthesisMessages.length - 1); setSynthesisReady(true); return; }
    if (synthesisStep < synthesisMessages.length - 1) {
      const timer = window.setTimeout(() => setSynthesisStep((step) => step + 1), 1100);
      return () => window.clearTimeout(timer);
    }
    const timer = window.setTimeout(() => setSynthesisReady(true), 900);
    return () => window.clearTimeout(timer);
  }, [detectedThemes, restored, session.currentIndex, synthesisStep]);

  if (!restored) return <main className="vision-shell vision-loading" aria-label="Restoring your vision session"><span /></main>;

  const complete = session.currentIndex === visionQuestions.length;
  const question = visionQuestions[session.currentIndex];
  const answered = visionQuestions.filter(({ id }) => session.answers[id]?.trim()).length;
  const percentage = Math.round((answered / visionQuestions.length) * 100);

  function updateAnswer(value: string) {
    setSession((current) => ({ ...current, answers: { ...current.answers, [question.id]: value } }));
  }

  function move(nextIndex: number, nextDirection: "forward" | "back") {
    setDirection(nextDirection);
    setSession((current) => ({ ...current, currentIndex: nextIndex }));
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }

  return (
    <main className="vision-shell">
      <div className="vision-atmosphere" aria-hidden="true"><i /><i /><span /><span /></div>
      {!complete ? (
        <div className="vision-layout">
          <header className="vision-progress">
            <div className="progress-meta">
              <div><span>Section {Math.floor(session.currentIndex / 3) + 1} of 5</span><strong>{question.section}</strong></div>
              <p>{percentage}%</p>
            </div>
            <div className="progress-track" role="progressbar" aria-label="Vision session completion" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}><span style={{ width: `${percentage}%` }} /></div>
          </header>

          <section className={`question-stage question-${direction}`} key={question.id} aria-labelledby="question-title">
            <p className="question-number">Question {session.currentIndex + 1} <span>of {visionQuestions.length}</span></p>
            <h1 id="question-title">{question.prompt}</h1>
            {question.context && <p className="question-context">{question.context}</p>}
            <label className="answer-wrap">
              <span className="sr-only">Your reflection</span>
              <textarea value={session.answers[question.id] ?? ""} onChange={(event) => updateAnswer(event.target.value)} onKeyDown={(event) => { if ((event.metaKey || event.ctrlKey) && event.key === "Enter" && session.answers[question.id]?.trim()) move(session.currentIndex + 1, "forward"); }} placeholder="Write what feels true…" rows={5} maxLength={4000} enterKeyHint="enter" />
              <small>{session.answers[question.id]?.trim() ? `${session.answers[question.id].trim().split(/\s+/).length} words` : "Take all the space you need"}</small>
            </label>
          </section>

          <footer className="question-actions">
            <button className="back-button" type="button" disabled={session.currentIndex === 0} onClick={() => move(session.currentIndex - 1, "back")}><span aria-hidden="true">←</span> Back</button>
            <p className="save-state" role="status"><span aria-hidden="true">✓</span> Vision saved</p>
            <button className="continue-button" type="button" disabled={!session.answers[question.id]?.trim()} onClick={() => move(session.currentIndex + 1, "forward")}>
              {session.currentIndex === visionQuestions.length - 1 ? "Complete" : "Continue"}<span aria-hidden="true">→</span>
            </button>
          </footer>
        </div>
      ) : (
        <section className={`vision-complete ${synthesisReady ? "synthesis-complete" : "synthesis-working"}`} aria-labelledby="complete-title" aria-live="polite">
          {!synthesisReady ? <><div className="synthesis-orbit" aria-hidden="true"><b /><b /><b /></div><p className="vision-kicker">Vision Synthesis</p><h1 id="complete-title" key={synthesisStep}>{synthesisMessages[synthesisStep]}</h1><div className="synthesis-steps" aria-hidden="true">{synthesisMessages.map((_, index) => <span className={index <= synthesisStep ? "active" : ""} key={index} />)}</div></> : <><span className="completion-rule" aria-hidden="true" /><p className="vision-kicker">Vision Synthesis Complete</p><h1 id="complete-title">Your vision is beginning to take shape.</h1><p>Your answers reveal a vision rooted in {detectedThemes.slice(0,3).map((theme) => theme.label.toLowerCase()).join(", ")}. The next chapter brings those patterns into focus.</p><div className="synthesis-theme-preview">{detectedThemes.map((theme) => <span key={theme.id}>{theme.label}</span>)}</div><div className="completion-actions"><Link className="vision-cta" href="/blueprint"><span>Reveal My Vision</span><span className="cta-arrow" aria-hidden="true">→</span></Link><button className="back-button" type="button" onClick={() => { setSynthesisReady(false); setSynthesisStep(0); move(visionQuestions.length - 1, "back"); }}>Review my answers</button></div></>}
        </section>
      )}
    </main>
  );
}
