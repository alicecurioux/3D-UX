import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CardModal from "./CardModal";
import type { CardData } from "./Release";

const TEAL_CARD: CardData = {
  number: "01",
  title: "Surface",
  description: "What you see on the screen",
  icon: "visibility",
  col: 3,
  row: 1,
  tone: "teal",
};

const RED_CARD: CardData = {
  number: "I",
  title: "User Research",
  description: "Understand target users",
  icon: "account_box",
  col: 1,
  row: 3,
  tone: "red",
};

// ── Rendering ─────────────────────────────────────────────────────────────────

describe("CardModal / rendering", () => {
  it("renders nothing when card is null", () => {
    const { container } = render(<CardModal card={null} size={{ width: 400, height: 400 }} onClose={vi.fn()} />);
    expect(container.firstChild).toBeNull();
  });

  it("renders number, title, description when card provided", () => {
    render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={vi.fn()} />);
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("Surface")).toBeInTheDocument();
    expect(screen.getByText("What you see on the screen")).toBeInTheDocument();
  });

  it("applies teal tone class and not red", () => {
    const { container } = render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={vi.fn()} />);
    expect(container.querySelector(".card-modal--teal")).toBeInTheDocument();
    expect(container.querySelector(".card-modal--red")).toBeNull();
  });

  it("applies red tone class and not teal", () => {
    const { container } = render(<CardModal card={RED_CARD} size={{ width: 400, height: 400 }} onClose={vi.fn()} />);
    expect(container.querySelector(".card-modal--red")).toBeInTheDocument();
    expect(container.querySelector(".card-modal--teal")).toBeNull();
  });

  it("sets width and height style from prop", () => {
    const { container } = render(<CardModal card={TEAL_CARD} size={{ width: 320, height: 320 }} onClose={vi.fn()} />);
    const modal = container.querySelector(".card-modal") as HTMLElement;
    expect(modal.style.width).toBe("320px");
    expect(modal.style.height).toBe("320px");
  });

  it("sets fractional dimensions (e.g. 337.5) from prop", () => {
    const { container } = render(<CardModal card={TEAL_CARD} size={{ width: 337.5, height: 337.5 }} onClose={vi.fn()} />);
    const modal = container.querySelector(".card-modal") as HTMLElement;
    expect(modal.style.width).toBe("337.5px");
    expect(modal.style.height).toBe("337.5px");
  });

  it("has dialog ARIA role on backdrop", () => {
    render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("has aria-modal attribute", () => {
    render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("renders an accessible close button", () => {
    render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={vi.fn()} />);
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });
});

// ── Close interactions ─────────────────────────────────────────────────────────

describe("CardModal / close interactions", () => {
  it("calls onClose when backdrop is clicked", async () => {
    const onClose = vi.fn();
    render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={onClose} />);
    await userEvent.click(screen.getByRole("dialog"));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does NOT call onClose when modal inner content is clicked", async () => {
    const onClose = vi.fn();
    render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={onClose} />);
    await userEvent.click(screen.getByText("Surface"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does NOT call onClose when modal number is clicked", async () => {
    const onClose = vi.fn();
    render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={onClose} />);
    await userEvent.click(screen.getByText("01"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when Escape key is pressed", () => {
    const onClose = vi.fn();
    render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("does NOT call onClose for Enter key", () => {
    const onClose = vi.fn();
    render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Enter" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does NOT call onClose for Space key", () => {
    const onClose = vi.fn();
    render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={onClose} />);
    fireEvent.keyDown(document, { key: " " });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does NOT call onClose for Tab key", () => {
    const onClose = vi.fn();
    render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Tab" });
    expect(onClose).not.toHaveBeenCalled();
  });
});

// ── Event listener lifecycle ───────────────────────────────────────────────────

describe("CardModal / event listener lifecycle", () => {
  it("does NOT attach any keydown listener when card is null", () => {
    const spy = vi.spyOn(document, "addEventListener");
    render(<CardModal card={null} size={{ width: 400, height: 400 }} onClose={vi.fn()} />);
    const keydownAdds = spy.mock.calls.filter(([ev]) => ev === "keydown");
    expect(keydownAdds).toHaveLength(0);
    spy.mockRestore();
  });

  it("attaches exactly one keydown listener when card is provided", () => {
    const spy = vi.spyOn(document, "addEventListener");
    render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={vi.fn()} />);
    const keydownAdds = spy.mock.calls.filter(([ev]) => ev === "keydown");
    expect(keydownAdds).toHaveLength(1);
    spy.mockRestore();
  });

  it("removes keydown listener on unmount", () => {
    const spy = vi.spyOn(document, "removeEventListener");
    const { unmount } = render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={vi.fn()} />);
    unmount();
    const keydownRemovals = spy.mock.calls.filter(([ev]) => ev === "keydown");
    expect(keydownRemovals).toHaveLength(1);
    spy.mockRestore();
  });

  it("removes keydown listener when card changes from a value to null", () => {
    const spy = vi.spyOn(document, "removeEventListener");
    const { rerender } = render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={vi.fn()} />);
    rerender(<CardModal card={null} size={{ width: 400, height: 400 }} onClose={vi.fn()} />);
    const keydownRemovals = spy.mock.calls.filter(([ev]) => ev === "keydown");
    expect(keydownRemovals.length).toBeGreaterThanOrEqual(1);
    spy.mockRestore();
  });

  it("Escape does NOT fire onClose after component unmount (no dangling listener)", () => {
    const onClose = vi.fn();
    const { unmount } = render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={onClose} />);
    unmount();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("Escape does NOT fire onClose after card transitions to null", () => {
    const onClose = vi.fn();
    const { rerender } = render(<CardModal card={TEAL_CARD} size={{ width: 400, height: 400 }} onClose={onClose} />);
    rerender(<CardModal card={null} size={{ width: 400, height: 400 }} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).not.toHaveBeenCalled();
  });
});
