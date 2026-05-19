import { useEffect, useState } from "react";
import { Icon } from "./icons";
import type { CardData } from "./Release";

type Props = {
  card: CardData | null;
  onClose: () => void;
};

function useVisualViewportWidth() {
  const [width, setWidth] = useState(
    () => window.visualViewport?.width ?? window.innerWidth
  );
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => setWidth(vv.width);
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);
  return width;
}

export default function CardModal({ card, onClose }: Props) {
  const vpWidth = useVisualViewportWidth();
  const modalWidth = Math.min(400, vpWidth * 0.9);

  useEffect(() => {
    if (!card) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [card, onClose]);

  if (!card) return null;

  return (
    <div className="card-modal-backdrop" onClick={onClose} aria-modal="true" role="dialog">
      <div
        className={`card-modal card-modal--${card.tone}`}
        style={{ width: modalWidth }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-modal__number">{card.number}</div>
        <div className="card-modal__title">{card.title}</div>
        <div className="card-modal__description">{card.description}</div>
        <div className="card-modal__icon">
          <Icon name={card.icon} />
        </div>
        <button className="card-modal__close" onClick={onClose} aria-label="Close">✕</button>
      </div>
    </div>
  );
}
