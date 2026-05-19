import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Release from "./Release";

const BASE = {
  label: "MVP",
  positionIndex: 0,
  totalCount: 4,
  zIndex: 4,
  isFront: true,
  onActivate: vi.fn(),
  onCardClick: vi.fn(),
};

// ── Front release ──────────────────────────────────────────────────────────────

describe("Release / front release", () => {
  it("renders the version label", () => {
    render(<Release {...BASE} />);
    expect(screen.getByText("MVP")).toBeInTheDocument();
  });

  it("renders all 11 card titles", () => {
    render(<Release {...BASE} />);
    const titles = [
      "Surface", "Skeleton", "Structure", "Scope", "Strategy",
      "User Research", "User Journeys", "Low-Fi Prototype",
      "High-Fi Prototype", "Validation & QA", "Analytics & Iteration",
    ];
    for (const title of titles) {
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  });

  it("calls onCardClick with correct CardData when a card is clicked", async () => {
    const onCardClick = vi.fn();
    render(<Release {...BASE} onCardClick={onCardClick} />);
    await userEvent.click(screen.getByText("Surface").closest(".card")!);
    expect(onCardClick).toHaveBeenCalledOnce();
    expect(onCardClick).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Surface",
        number: "01",
        tone: "teal",
        icon: "visibility",
        col: 3,
        row: 1,
      })
    );
  });

  it("calls onCardClick with correct data for a red card", async () => {
    const onCardClick = vi.fn();
    render(<Release {...BASE} onCardClick={onCardClick} />);
    await userEvent.click(screen.getByText("User Research").closest(".card")!);
    expect(onCardClick).toHaveBeenCalledWith(
      expect.objectContaining({ title: "User Research", tone: "red" })
    );
  });

  it("card click does NOT propagate to release (onActivate not called)", async () => {
    const onActivate = vi.fn();
    render(<Release {...BASE} onActivate={onActivate} />);
    await userEvent.click(screen.getByText("Surface").closest(".card")!);
    expect(onActivate).not.toHaveBeenCalled();
  });

  it("does NOT have button role on front release div", () => {
    render(<Release {...BASE} isFront={true} />);
    expect(screen.queryByRole("button", { name: /bring MVP to front/i })).toBeNull();
  });

  it("has tabIndex=-1 on front release div", () => {
    const { container } = render(<Release {...BASE} isFront={true} />);
    const releaseEl = container.querySelector(".release") as HTMLElement;
    expect(releaseEl.getAttribute("tabindex")).toBe("-1");
  });

  it("applies release--front class", () => {
    const { container } = render(<Release {...BASE} isFront={true} />);
    expect(container.querySelector(".release--front")).toBeInTheDocument();
    expect(container.querySelector(".release--back")).toBeNull();
  });

  it("clicking the front release itself does NOT call onActivate", async () => {
    const onActivate = vi.fn();
    const { container } = render(<Release {...BASE} isFront={true} onActivate={onActivate} />);
    await userEvent.click(container.querySelector(".release")!);
    expect(onActivate).not.toHaveBeenCalled();
  });
});

// ── Back release ───────────────────────────────────────────────────────────────

describe("Release / back release", () => {
  const BACK = { ...BASE, isFront: false, zIndex: 1 };

  it("renders the version label", () => {
    render(<Release {...BACK} />);
    expect(screen.getByText("MVP")).toBeInTheDocument();
  });

  it("has button role with accessible label", () => {
    render(<Release {...BACK} />);
    expect(screen.getByRole("button", { name: /bring MVP to front/i })).toBeInTheDocument();
  });

  it("applies release--back class", () => {
    const { container } = render(<Release {...BACK} />);
    expect(container.querySelector(".release--back")).toBeInTheDocument();
    expect(container.querySelector(".release--front")).toBeNull();
  });

  it("calls onActivate when clicked", async () => {
    const onActivate = vi.fn();
    render(<Release {...BACK} onActivate={onActivate} />);
    await userEvent.click(screen.getByRole("button", { name: /bring MVP to front/i }));
    expect(onActivate).toHaveBeenCalledOnce();
  });

  it("calls onActivate on Enter key", async () => {
    const onActivate = vi.fn();
    render(<Release {...BACK} onActivate={onActivate} />);
    screen.getByRole("button", { name: /bring MVP to front/i }).focus();
    await userEvent.keyboard("{Enter}");
    expect(onActivate).toHaveBeenCalledOnce();
  });

  it("calls onActivate on Space key", async () => {
    const onActivate = vi.fn();
    render(<Release {...BACK} onActivate={onActivate} />);
    screen.getByRole("button", { name: /bring MVP to front/i }).focus();
    await userEvent.keyboard(" ");
    expect(onActivate).toHaveBeenCalledOnce();
  });

  it("has tabIndex=0 on back release div", () => {
    const { container } = render(<Release {...BACK} />);
    const releaseEl = container.querySelector(".release") as HTMLElement;
    expect(releaseEl.getAttribute("tabindex")).toBe("0");
  });
});

// ── Transform & positioning ────────────────────────────────────────────────────

describe("Release / positioning", () => {
  it("applies correct translate for first item (positionIndex=0, totalCount=4)", () => {
    const { container } = render(<Release {...BASE} positionIndex={0} totalCount={4} />);
    const releaseEl = container.querySelector(".release") as HTMLElement;
    // stepsFromRight = 4-1-0 = 3 → x = -240, y = 0
    expect(releaseEl.style.transform).toBe("translate(-240px, 0px)");
  });

  it("applies correct translate for last item (positionIndex=3, totalCount=4)", () => {
    const { container } = render(<Release {...BASE} positionIndex={3} totalCount={4} />);
    const releaseEl = container.querySelector(".release") as HTMLElement;
    // stepsFromRight = 4-1-3 = 0 → x = 0, y = -240
    expect(releaseEl.style.transform).toBe("translate(0px, -240px)");
  });

  it("applies zIndex from prop", () => {
    const { container } = render(<Release {...BASE} zIndex={7} />);
    const releaseEl = container.querySelector(".release") as HTMLElement;
    expect(releaseEl.style.zIndex).toBe("7");
  });
});
