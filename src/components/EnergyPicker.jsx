import { energyLevels } from "../data/questTemplates";

export default function EnergyPicker({
  energy,
  setEnergy,
}) {
  return (
    <div className="energy-picker">
      {Object.values(energyLevels).map((option) => {
        const selected = energy === option.id;

        return (
          <button
            key={option.id}
            type="button"
            className={`energy-option ${
              selected ? "selected" : ""
            }`}
            onClick={() => setEnergy(option.id)}
            aria-pressed={selected}
          >
            <span className="energy-emoji">
              {option.emoji}
            </span>

            <span className="energy-name">
              {option.label}
            </span>

            <span className="energy-description">
              {option.description}
            </span>
          </button>
        );
      })}
    </div>
  );
}