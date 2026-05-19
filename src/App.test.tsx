import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

// Scope card queries to the front release so back-release copies don't interfere.
const frontCard = (container: HTMLElement, title: string) => {
  const front = container.querySelector(".release--front")!;
  return within(front as HTMLElement).getByText(title).closest(".card") as HTMLElement;
};

const backReleaseFor = (label: RegExp | string) =>
  screen.queryByRole("button", { name: new RegExp(`bring ${label} to front`, "i") });

describe("App", () => {
  it("renders the page title", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /3 dimensions of ux design/i })
    ).toBeInTheDocument();
  });

  it("starts with MVP at the front and the other three as back releases", () => {
    render(<App />);
    expect(backReleaseFor("MVP")).toBeNull();
    expect(backReleaseFor("Version 1")).toBeInTheDocument();
    expect(backReleaseFor("Version 2")).toBeInTheDocument();
    expect(backReleaseFor("\\.\\.\\. Version N")).toBeInTheDocument();
  });

  it("brings a back release to the front when clicked", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(backReleaseFor("Version 2")!);
    expect(backReleaseFor("Version 2")).toBeNull();
    expect(backReleaseFor("MVP")).toBeInTheDocument();
  });

  it("treats a click on the front release as a no-op", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("MVP"));
    expect(backReleaseFor("MVP")).toBeNull();
    expect(backReleaseFor("Version 1")).toBeInTheDocument();
  });

  it("activates a back release with the Enter key", async () => {
    const user = userEvent.setup();
    render(<App />);
    const v1 = backReleaseFor("Version 1")!;
    v1.focus();
    await user.keyboard("{Enter}");
    expect(backReleaseFor("Version 1")).toBeNull();
    expect(backReleaseFor("MVP")).toBeInTheDocument();
  });

  it("activates a back release with the Space key", async () => {
    const user = userEvent.setup();
    render(<App />);
    const vn = backReleaseFor("\\.\\.\\. Version N")!;
    vn.focus();
    await user.keyboard(" ");
    expect(backReleaseFor("\\.\\.\\. Version N")).toBeNull();
  });

  it("preserves relative order of the unselected releases", async () => {
    const user = userEvent.setup();
    render(<App />);
    // Initial z-index order is mvp > v1 > v2 > vn.
    // Bringing v2 to front should yield v2 > mvp > v1 > vn.
    await user.click(backReleaseFor("Version 2")!);

    const zOf = (label: string) => {
      const el = screen.getByText(label).closest(".release") as HTMLElement;
      return Number(el.style.zIndex);
    };
    expect(zOf("Version 2")).toBeGreaterThan(zOf("MVP"));
    expect(zOf("MVP")).toBeGreaterThan(zOf("Version 1"));
    expect(zOf("Version 1")).toBeGreaterThan(zOf("... Version N"));
  });
});

// ── Modal integration ──────────────────────────────────────────────────────────

describe("App / modal", () => {
  it("modal is not in the DOM before any card is clicked", () => {
    render(<App />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("clicking a card in a back release does NOT open the modal", async () => {
    // Back-release cards have tabIndex=-1 and no onClick — JS-level guard.
    // This test verifies the guard works even when CSS pointer-events fails.
    const user = userEvent.setup();
    const { container } = render(<App />);
    // Find a card in one of the back (non-front) releases
    const backRelease = container.querySelector(".release--back")!;
    const backCard = backRelease.querySelector(".card") as HTMLElement;
    await user.click(backCard);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens modal when a card on the front release is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(frontCard(container, "Surface"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("modal shows the clicked card's title", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(frontCard(container, "Strategy"));
    const dialog = screen.getByRole("dialog");
    expect(dialog.textContent).toContain("Strategy");
  });

  it("closes modal when backdrop is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(frontCard(container, "Surface"));
    await user.click(screen.getByRole("dialog"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes modal when close button is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(frontCard(container, "Surface"));
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("closes modal on Escape key", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(frontCard(container, "Surface"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("can open modal for a red card", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(frontCard(container, "User Research"));
    const dialog = screen.getByRole("dialog");
    expect(dialog.querySelector(".card-modal--red")).toBeInTheDocument();
  });

  it("can open a different card after closing the first", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(frontCard(container, "Surface"));
    await user.click(screen.getByRole("dialog"));
    await user.click(frontCard(container, "Skeleton"));
    const dialog = screen.getByRole("dialog");
    expect(dialog.textContent).toContain("Skeleton");
  });
});

// ── Modal width calculation ────────────────────────────────────────────────────

describe("App / modal width", () => {
  afterEach(() => {
    // Restore visualViewport to jsdom default (undefined)
    try {
      Object.defineProperty(window, "visualViewport", {
        value: undefined,
        configurable: true,
        writable: true,
      });
    } catch {
      // ignore if property is not configurable in this env
    }
  });

  it("caps modal width at 400px when viewport is large", async () => {
    Object.defineProperty(window, "visualViewport", {
      value: { width: 1440 },
      configurable: true,
      writable: true,
    });
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(frontCard(container, "Surface"));
    const modal = container.querySelector(".card-modal") as HTMLElement;
    // Math.min(400, 1440 * 0.9) = 400
    expect(modal.style.width).toBe("400px");
  });

  it("uses 90% of visualViewport.width when narrower than 444px", async () => {
    Object.defineProperty(window, "visualViewport", {
      value: { width: 375 },
      configurable: true,
      writable: true,
    });
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(frontCard(container, "Surface"));
    const modal = container.querySelector(".card-modal") as HTMLElement;
    // Math.min(400, 375 * 0.9) = 337.5
    expect(modal.style.width).toBe("337.5px");
  });

  it("falls back to innerWidth when visualViewport is undefined", async () => {
    Object.defineProperty(window, "visualViewport", {
      value: undefined,
      configurable: true,
      writable: true,
    });
    Object.defineProperty(window, "innerWidth", {
      value: 320,
      configurable: true,
      writable: true,
    });
    const user = userEvent.setup();
    const { container } = render(<App />);
    await user.click(frontCard(container, "Surface"));
    const modal = container.querySelector(".card-modal") as HTMLElement;
    // Math.min(400, 320 * 0.9) = 288
    expect(modal.style.width).toBe("288px");
  });
});

// ── Page-load safety (no listeners, no viewport API access on mount) ────────────

describe("App / page-load safety", () => {
  it("adds zero keydown listeners during initial render", () => {
    const spy = vi.spyOn(document, "addEventListener");
    render(<App />);
    const keydownAdds = spy.mock.calls.filter(([ev]) => ev === "keydown");
    expect(keydownAdds).toHaveLength(0);
    spy.mockRestore();
  });

  it("does NOT access window.visualViewport during initial render", () => {
    let accessed = false;
    const saved = Object.getOwnPropertyDescriptor(window, "visualViewport");
    Object.defineProperty(window, "visualViewport", {
      get: () => { accessed = true; return undefined; },
      configurable: true,
    });
    render(<App />);
    expect(accessed).toBe(false);
    if (saved) {
      Object.defineProperty(window, "visualViewport", saved);
    }
  });

  it("does NOT access window.innerWidth during initial render", () => {
    let accessed = false;
    const saved = Object.getOwnPropertyDescriptor(window, "innerWidth");
    Object.defineProperty(window, "innerWidth", {
      get: () => { accessed = true; return 1024; },
      configurable: true,
    });
    render(<App />);
    expect(accessed).toBe(false);
    if (saved) {
      Object.defineProperty(window, "innerWidth", saved);
    }
  });
});
