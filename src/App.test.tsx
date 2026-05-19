import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

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
