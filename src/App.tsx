import { useState, useEffect } from "react";
import Release, { type CardData } from "./Release";
import { Icon } from "./icons";

type VersionId = "mvp" | "v1" | "v2" | "vn";

const VERSIONS: { id: VersionId; label: string }[] = [
  { id: "mvp", label: "MVP" },
  { id: "v1", label: "Version 1" },
  { id: "v2", label: "Version 2" },
  { id: "vn", label: "... Version N" },
];

export default function App() {
  // Stack order: first element is at the FRONT (highest z-index).
  const [stack, setStack] = useState<VersionId[]>(["mvp", "v1", "v2", "vn"]);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);

  const bringToFront = (id: VersionId) => {
    setStack((prev) => {
      if (prev[0] === id) return prev;
      const rest = prev.filter((v) => v !== id);
      return [id, ...rest];
    });
  };

  useEffect(() => {
    if (!activeCard) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setActiveCard(null); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [activeCard]);

  return (
    <div className="app">
      <h1 className="page-title">The 3 Dimensions of UX Design</h1>

      <div className="stage">
        <div className="stack">
          {VERSIONS.map((v, i) => {
            const z = stack.length - stack.indexOf(v.id); // higher z = closer to front
            return (
              <Release
                key={v.id}
                label={v.label}
                positionIndex={i}
                totalCount={VERSIONS.length}
                zIndex={z}
                isFront={stack[0] === v.id}
                onActivate={() => bringToFront(v.id)}
                onCardSelect={setActiveCard}
              />
            );
          })}
        </div>
      </div>

      {/* Mobile card modal — rendered here at app root, outside any transform context */}
      {activeCard && (
        <div className="card-modal" onClick={() => setActiveCard(null)}>
          <div
            className={`card-modal__content card--${activeCard.tone}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="card-modal__close" onClick={() => setActiveCard(null)}>✕</button>
            <div className="card__number">{activeCard.number}</div>
            <div className="card__title">{activeCard.title}</div>
            <div className="card__description">{activeCard.description}</div>
            <div className="card__icon"><Icon name={activeCard.icon} /></div>
          </div>
        </div>
      )}
    </div>
  );
}
