import Image from "next/image";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <main className="welcome-shell">
      <div className="atmosphere" aria-hidden="true">
        <span className="light-ray light-ray-one" />
        <span className="light-ray light-ray-two" />
        <span className="ember ember-one" />
        <span className="ember ember-two" />
        <span className="ember ember-three" />
      </div>

      <section className="welcome-content" aria-labelledby="welcome-title">
        <p className="session-label"><span />Your Rooted Essence Vision Session<span /></p>

        <div className="emblem-stage">
          <div className="emblem-halo" aria-hidden="true" />
          <Image
            className="emblem"
            src="/rooted-essence-logo.png"
            alt="Rooted Essence emblem"
            width={1024}
            height={1024}
            priority
            sizes="(max-width: 640px) 66vw, 390px"
          />
        </div>

        <div className="welcome-copy">
          <h1 id="welcome-title">Discover What Your Vision Can Become</h1>
          <p>A guided experience designed to uncover the purpose, possibilities, and future of Rooted Essence.</p>
        </div>

        <Link className="vision-cta" href="/vision">
          <span>Begin the Vision</span>
          <span className="cta-arrow" aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
