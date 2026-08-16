import ComicBurst from "./ComicBurst";

export default function Hero() {
  return (
    <section className="hero">
      <ComicBurst
        text="GO!"
        className="hero-burst hero-burst-left"
      />

      <ComicBurst
        text="ZAP!"
        className="hero-burst hero-burst-right"
      />

      <div className="eyebrow">
        ⚡ YOUR NEXT MOVE
      </div>

      <h1>
        STOP
        <br />
        THINKING.
        <br />

        <span>START DOING.</span>
      </h1>

      <p className="hero-description">
        Tell QuestPop what you're stuck on.
        We'll turn the chaos into one tiny mission
        you can start right now.
      </p>

      <div className="hero-stickers">
        <span>NO SIGN-UP</span>
        <span>NO 27-STEP PLAN</span>
        <span>JUST GO</span>
      </div>
    </section>
  );
}