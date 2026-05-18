import { useState, useEffect, useRef } from "react";
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
  const [stack, setStack] = useState<VersionId[]>(["mvp", "v1", "v2", "vn"]);
  const [activeCard, setActiveCard] = useState<CardData | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const bringToFront = (id: VersionId) => {
    setStack((prev) => {
      if (prev[0] === id) return prev;
      const rest = prev.filter((v) => v !== id);
      return [id, ...rest];
    });
  };

  // Open/close the native dialog in sync with activeCard state.
  // showModal() renders in the browser top-layer — immune to CSS transforms
  // and overflow:hidden on any ancestor.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (activeCard && !dialog.open) {
      dialog.showModal();
    } else if (!activeCard && dialog.open) {
      dialog.close();
    }
  }, [activeCard]);

  return (
    <div className="app">
      <h1 className="page-title">The 3 Dimensions of UX Design</h1>

      <div className="stage">
        <div className="stack">
          {VERSIONS.map((v, i) => {
            const z = stack.length - stack.indexOf(v.id);
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

      {/* Native <dialog> with showModal() renders in browser top-layer */}
      <dialog
        ref={dialogRef}
        className="card-modal-dialog"
        onClick={(e) => { if (e.target === dialogRef.current) setActiveCard(null); }}
        onClose={() => setActiveCard(null)}
      >
        {activeCard && (
          <div className={`card-modal__content card--${activeCard.tone}`}>
            <button className="card-modal__close" onClick={() => setActiveCard(null)}>✕</button>
            <div className="card__number">{activeCard.number}</div>
            <div className="card__title">{activeCard.title}</div>
            <div className="card__description">{activeCard.description}</div>
            <div className="card__icon"><Icon name={activeCard.icon} /></div>
          </div>
        )}
      </dialog>
    </div>
  );
}
