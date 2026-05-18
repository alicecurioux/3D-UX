import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Icon, type IconName } from "./icons";

describe("Icon", () => {
  it("renders an svg path for a known icon name", () => {
    const { container } = render(<Icon name="visibility" />);
    expect(container.querySelector("svg")).not.toBeNull();
    expect(container.querySelector("path")).not.toBeNull();
  });

  it("returns null for an unknown name at runtime", () => {
    const { container } = render(<Icon name={"does_not_exist" as unknown as IconName} />);
    expect(container.querySelector("svg")).toBeNull();
  });
});
