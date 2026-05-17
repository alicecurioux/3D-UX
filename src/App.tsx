import { useState } from "react";
import Release from "./Release";

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

  const bringToFront = (id: VersionId) => {
    setStack((prev) => {
      if (prev[0] === id) return prev;
      const rest = prev.filter((v) => v !== id);
      return [id, ...rest];
    });
  };

  return (
    <div className="app">
      <h1 className="page-title">What UX Design Actually Is</h1>

      <div className="stage">
        <div className="stack">
          {VERSIONS.map((v) => {
            const z = stack.length - stack.indexOf(v.id); // higher z = closer to front
            const depth = stack.indexOf(v.id); // 0 = front, n = back
            return (
              <Release
                key={v.id}
                label={v.label}
                depth={depth}
                zIndex={z}
                isFront={depth === 0}
                onActivate={() => bringToFront(v.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
