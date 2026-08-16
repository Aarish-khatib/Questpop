import { useState } from "react";
import EnergyPicker from "./EnergyPicker";

export default function QuestInput({
  onStart,
}) {
  const [goal, setGoal] = useState("");
  const [energy, setEnergy] =
    useState("normal");

  function handleSubmit(event) {
    event.preventDefault();

    const cleanGoal = goal.trim();

    if (!cleanGoal) {
      return;
    }

    onStart(cleanGoal, energy);
  }

  return (
    <section className="quest-input-section">
      <form
        className="quest-box"
        onSubmit={handleSubmit}
      >
        <div className="panel-number">
          01
        </div>

        <label
          className="field-label"
          htmlFor="quest-goal"
        >
          WHAT ARE YOU STUCK ON?
        </label>

        <input
          id="quest-goal"
          className="goal-input"
          type="text"
          value={goal}
          onChange={(event) =>
            setGoal(event.target.value)
          }
          placeholder="e.g. Finish my science project"
          maxLength={140}
          autoComplete="off"
          autoFocus
        />

        <div className="character-count">
          {goal.length}/140
        </div>

        <div className="field-label energy-label">
          HOW MUCH POWER DO YOU HAVE?
        </div>

        <EnergyPicker
          energy={energy}
          setEnergy={setEnergy}
        />

        <button
          className="pop-button"
          type="submit"
          disabled={!goal.trim()}
        >
          <span>💥</span>
          POP! START ME
        </button>

        <p className="input-footnote">
          One goal. One click. One next move.
        </p>
      </form>
    </section>
  );
}