"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { generateStrategy, type StrategyBlueprint as Blueprint } from "@/lib/strategy-generator";

const SESSION_KEY = "rooted-essence-vision-session-v1";
const SYNTHESIS_KEY = "rooted-essence-vision-synthesis-v1";

function loadBlueprint() {
  let answers: Record<string, string> = {};
  let themeNames: string[] = [];
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) ?? "{}") as { answers?: Record<string, string> };
    answers = session.answers ?? {};
    const synthesis = JSON.parse(localStorage.getItem(SYNTHESIS_KEY) ?? "{}") as { themes?: Array<string | { name?: string; label?: string }> };
    themeNames = (synthesis.themes ?? []).map((theme) => typeof theme === "string" ? theme : theme.name ?? theme.label ?? "").filter(Boolean);
  } catch { /* Deterministic fallbacks keep the blueprint useful. */ }
  return generateStrategy(answers, themeNames);
}

function SectionHeading({ number, title, intro }: { number: string; title: string; intro?: string }) {
  return <header className="strategy-section-heading"><p>{number}</p><div><span>Rooted Essence Founder Blueprint</span><h2>{title}</h2>{intro && <p>{intro}</p>}</div></header>;
}

export function StrategyBlueprint() {
  const [blueprint, setBlueprint] = useState<Blueprint | null>(null);
  const [deliveryEmail, setDeliveryEmail] = useState("");

  useEffect(() => setBlueprint(loadBlueprint()), []);
  useEffect(() => {
    if (!blueprint) return;
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add("is-visible")), { threshold: .12 });
    document.querySelectorAll(".strategy-reveal").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [blueprint]);

  if (!blueprint) return <main className="strategy-page strategy-loading" aria-label="Opening your founder blueprint"><div className="root-pulse" /></main>;

  const emailBody = [
    "ROOTED ESSENCE — FOUNDER VISION",
    "",
    `Mission: ${blueprint.foundation.mission}`,
    "",
    `Purpose: ${blueprint.foundation.purpose}`,
    "",
    `Brand position: ${blueprint.position.different}`,
    "",
    `Emotional promise: ${blueprint.position.promise}`,
    "",
    `Immediate priorities: ${blueprint.nextSteps.slice(0, 4).map((step) => step.title).join("; ")}.`,
    "",
    "Created through the Rooted Essence Vision Experience.",
  ].join("\n").slice(0, 1800);
  const emailHref = `mailto:${encodeURIComponent(deliveryEmail.trim())}?subject=${encodeURIComponent("Rooted Essence Founder Vision")}&body=${encodeURIComponent(emailBody)}`;

  return (
    <main className="strategy-page">
      <div className="strategy-atmosphere" aria-hidden="true"><i /><i /><span /><span /></div>
      <section className="strategy-hero strategy-reveal">
        <Image src="/rooted-essence-logo.png" alt="Rooted Essence emblem" width={1024} height={1024} priority sizes="(max-width: 640px) 28vw, 150px" />
        <p className="strategy-kicker">Rooted Essence Vision Experience</p>
        <h1>The Founder Blueprint</h1>
        <p>A strategic expression of the purpose, possibilities, and direction already present in Jessica’s vision.</p>
        <div className="strategy-theme-line">{blueprint.vision.themes.map((theme) => <span key={theme.id}>{theme.label}</span>)}</div>
      </section>

      <div className="strategy-content">
        <section className="strategy-section strategy-reveal"><SectionHeading number="01" title="Brand Foundation" />
          <div className="foundation-grid"><article className="strategy-card statement-card"><span>Mission</span><p>{blueprint.foundation.mission}</p></article><article className="strategy-card statement-card"><span>Vision</span><p>{blueprint.foundation.vision}</p></article><article className="strategy-card statement-card wide"><span>Purpose</span><p>{blueprint.foundation.purpose}</p></article></div>
          <div className="strategy-pair"><article><h3>Brand Personality</h3><div className="strategy-tags">{blueprint.foundation.personality.map((item) => <span key={item}>{item}</span>)}</div></article><article><h3>Core Values</h3><ol className="value-list">{blueprint.foundation.values.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol></article></div>
        </section>

        <section className="strategy-section strategy-reveal"><SectionHeading number="02" title="Ideal Client" intro="The woman Rooted Essence is best positioned to serve." />
          <article className="client-profile"><p>{blueprint.client.profile}</p></article><div className="detail-grid">{(["lifestyle","motivations","frustrations","transformation"] as const).map((key) => <article className="strategy-card" key={key}><span>{key}</span><p>{blueprint.client[key]}</p></article>)}</div>
        </section>

        <section className="strategy-section strategy-reveal"><SectionHeading number="03" title="Brand Position" /><div className="position-stack"><article><span>Why it exists</span><p>{blueprint.position.exists}</p></article><article><span>What makes it different</span><p>{blueprint.position.different}</p></article><article className="promise"><span>Emotional promise</span><p>“{blueprint.position.promise}”</p></article></div></section>

        <section className="strategy-section strategy-reveal"><SectionHeading number="04" title="Business Opportunities" intro="Directions supported by the language and ambitions in Jessica’s answers." /><div className="opportunity-grid">{blueprint.opportunities.map((item, index) => <article className="strategy-card" key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.rationale}</p></article>)}</div></section>

        <section className="strategy-section strategy-reveal"><SectionHeading number="05" title="Website Direction" /><div className="website-list">{blueprint.website.map((item) => <article key={item.page}><h3>{item.page}</h3><p>{item.direction}</p></article>)}</div></section>

        <section className="strategy-section strategy-reveal"><SectionHeading number="06" title="Product Roadmap" intro={blueprint.products.length ? "Potential products supported by the needs named in the vision." : "A product line should follow clear evidence, not precede it."} />
          {blueprint.products.length ? <div className="product-grid">{blueprint.products.map((item) => <article className="strategy-card" key={item.name}><div className="product-orbit" aria-hidden="true" /><h3>{item.name}</h3><p>{item.direction}</p></article>)}</div> : <article className="strategy-card strategy-empty"><h3>Validate before formulating</h3><p>Jessica’s current answers do not identify a specific enough product need. Begin with client interviews and repeated requests, then choose one focused concept.</p></article>}
        </section>

        <section className="strategy-section strategy-reveal"><SectionHeading number="07" title="Brand Experience" /><div className="experience-grid">{blueprint.experience.map((item) => <article key={item.label}><span>{item.label}</span><p>{item.recommendation}</p></article>)}</div></section>

        <section className="strategy-section strategy-reveal"><SectionHeading number="08" title="Growth Roadmap" intro="A realistic sequence: foundation first, expansion after evidence." /><div className="phase-grid">{blueprint.phases.map((phase) => <article className="strategy-card" key={phase.phase}><span>{phase.phase}</span><h3>{phase.title}</h3><p>{phase.focus}</p><ul>{phase.actions.map((action) => <li key={action}>{action}</li>)}</ul></article>)}</div></section>

        <section className="strategy-section strategy-reveal"><SectionHeading number="09" title="Immediate Next Steps" intro="The highest-leverage actions to move the vision into motion." /><ol className="next-step-list">{blueprint.nextSteps.map((step, index) => <li key={step.title}><span>{String(index + 1).padStart(2,"0")}</span><div><h3>{step.title}</h3><p>{step.reason}</p></div></li>)}</ol></section>
      </div>

      <footer className="strategy-finale strategy-reveal"><p className="strategy-kicker">The blueprint is a beginning.</p><h2>Build what is true. Grow what is ready.</h2><div className="strategy-placeholder-actions"><button type="button" disabled>Download Vision <span>Coming soon</span></button><button type="button" disabled>Continue Building <span>Coming soon</span></button></div><section className="email-delivery" aria-labelledby="email-delivery-title"><span>Keep the vision close</span><h3 id="email-delivery-title">Open a beautifully prepared email summary.</h3><p>No information is sent or stored. This opens your own email app with a concise version of the vision ready to review.</p><label><span>Email recipient <small>(optional)</small></span><input type="email" inputMode="email" autoComplete="email" value={deliveryEmail} onChange={(event) => setDeliveryEmail(event.target.value)} placeholder="jessica@example.com" /></label><a className="email-cta" href={emailHref}>Open Prefilled Email <span aria-hidden="true">↗</span></a></section><small>Rooted Essence · Founder Blueprint</small></footer>
    </main>
  );
}
