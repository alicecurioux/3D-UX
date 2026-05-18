import { Icon } from "./icons";

type CardData = {
  number: string;
  title: string;
  description: string;
  icon: string; // Material Symbols name
  col: number; // 1..7
  row: number; // 1..5
  tone: "teal" | "red";
};

// Vertical (Depth) column: column 3, all rows. Structure is shared with horizontal.
// Horizontal (Width) row: row 3, all 7 columns; column 3 is Structure (teal).
const CARDS: CardData[] = [
  // Teal vertical (Depth)
  { number: "01", title: "Surface", description: "What you see on the screen, e.g, colors, type, spacing, corners, drop shadow...", icon: "visibility", col: 3, row: 1, tone: "teal" },
  { number: "02", title: "Skeleton", description: "How elements are laid out on the screen for interactions, e.g, lists, tables, charts...", icon: "smartphone", col: 3, row: 2, tone: "teal" },
  { number: "03", title: "Structure", description: "Map out content and information relationships for user navigation", icon: "account_tree", col: 3, row: 3, tone: "teal" },
  { number: "04", title: "Scope", description: "Usage and interaction requirements & specifications", icon: "format_list_bulleted", col: 3, row: 4, tone: "teal" },
  { number: "05", title: "Strategy", description: "Determining the right approach to develop & evolve UX to attain biz/project goals", icon: "strategy", col: 3, row: 5, tone: "teal" },
  // Red horizontal (Width). Structure at col 3 is shared (already drawn as teal).
  { number: "I", title: "User Research", description: "Understand the target users' needs and pains to devise a way to serve them", icon: "account_box", col: 1, row: 3, tone: "red" },
  { number: "II", title: "User Journeys", description: "Tell the story of how target user groups go through the system to achieve their goals", icon: "map", col: 2, row: 3, tone: "red" },
  { number: "III", title: "Low-Fi Prototype", description: "Create quick design mockups to explore options and get early user feedback", icon: "image", col: 4, row: 3, tone: "red" },
  { number: "IV", title: "High-Fi Prototype", description: "Make finalized, interactive designs ready for delivery — in AI age, this could be code", icon: "photo_frame", col: 5, row: 3, tone: "red" },
  { number: "V", title: "Validation & QA", description: "Validate and QA that developed solution achieves user and project goals", icon: "labs", col: 6, row: 3, tone: "red" },
  { number: "VI", title: "Analytics & Iteration", description: "After launch, analyze real-life usage and iterate the design", icon: "analytics", col: 7, row: 3, tone: "red" },
];

type Props = {
  label: string;
  positionIndex: number; // 0 = bottom-left, totalCount-1 = top-right
  totalCount: number;
  zIndex: number;
  isFront: boolean;
  onActivate: () => void;
};

export default function Release({ label, positionIndex, totalCount, zIndex, isFront, onActivate }: Props) {
  // Fixed location based on version order — diagonal from bottom-left to top-right.
  // Position never changes when the stack reshuffles; only zIndex does.
  const stepsFromRight = totalCount - 1 - positionIndex;
  const x = -stepsFromRight * 80;
  const y = -positionIndex * 80;
  return (
    <div
      className={`release${isFront ? " release--front" : " release--back"}`}
      style={{
        zIndex,
        transform: `translate(${x}px, ${y}px)`,
      }}
      onClick={() => {
        if (!isFront) onActivate();
      }}
      onKeyDown={(e) => {
        if (!isFront && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onActivate();
        }
      }}
      role={isFront ? undefined : "button"}
      tabIndex={isFront ? -1 : 0}
      aria-label={isFront ? undefined : `Bring ${label} to front`}
    >
      <div className="release__header">
        <div className="release__version-label">{label}</div>
        <div className="release__evolution">↻ Evolution of UX Design</div>
      </div>

      <div className="release__grid">
        <div className="release__depth-header">
          <div className="release__depth-line1">↓ Depth of UX Design</div>
          <div className="release__depth-line2">(Ref: 5 Planes of UX by Jesse James Garrett)</div>
        </div>

        <div className="release__width-header">
          <div className="release__width-line1">→ Width of UX Design</div>
          <div className="release__width-line2">(Iterative Design Process)</div>
        </div>

        <Arrows />

        {CARDS.map((card) => (
          <div
            key={`${card.number}-${card.title}`}
            className={`card card--${card.tone}`}
            style={{ gridColumn: card.col, gridRow: card.row }}
            tabIndex={0}
          >
            <div className="card__number">{card.number}</div>
            <div className="card__title">{card.title}</div>
            <div className="card__description">{card.description}</div>
            <div className="card__icon">
              <Icon name={card.icon} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Arrows() {
  // Drawn as an SVG overlay sized to the card grid.
  return (
    <svg className="release__arrows" viewBox="0 0 2400 1680" preserveAspectRatio="none" aria-hidden="true">
      {/* Vertical arrow through teal column (col 3 = x 720..960, center x = 840) */}
      <line x1="840" y1="240" x2="840" y2="1442" stroke="#d9d9d9" strokeWidth="2" />
      <polygon points="840,1462 830,1442 850,1442" fill="#d9d9d9" />

      {/* Horizontal arrow through red row (row 3 = y 720..960, center y = 840) */}
      <line x1="120" y1="840" x2="2280" y2="840" stroke="#d9d9d9" strokeWidth="2" />
      <polygon points="2300,840 2280,830 2280,850" fill="#d9d9d9" />

      {/* Dashed loopback: from below VI (rightmost) curving back to below I (leftmost) */}
      <path
        d="M 2280,960 Q 2280,1100 2160,1100 L 240,1100 Q 120,1100 120,960"
        stroke="#d9d9d9"
        strokeWidth="2"
        fill="none"
        strokeDasharray="8 8"
      />
      <polygon points="120,940 110,970 130,970" fill="#d9d9d9" />
    </svg>
  );
}
