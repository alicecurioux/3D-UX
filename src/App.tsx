import { useState } from "react";
import Release, { type CardData } from "./Release";
import CardModal from "./CardModal";

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
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [modalSize, setModalSize] = useState({ width: 400, height: 400 });

  const bringToFront = (id: VersionId) => {
    setStack((prev) => {
      if (prev[0] === id) return prev;
      const rest = prev.filter((v) => v !== id);
      return [id, ...rest];
    });
  };

  const openCard = (card: CardData) => {
    const vpw = window.visualViewport?.width ?? window.innerWidth;
    const vph = window.visualViewport?.height ?? window.innerHeight;
    const width = Math.min(400, vpw * 0.9);
    const height = Math.min(width, vph * 0.9);
    setModalSize({ width, height });
    setSelectedCard(card);
  };

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
                onCardClick={openCard}
              />
            );
          })}
        </div>
      </div>
      <CardModal card={selectedCard} size={modalSize} onClose={() => setSelectedCard(null)} />
    </div>
  );
}
