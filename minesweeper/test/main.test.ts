import { expect, test, describe, beforeEach } from "vitest";

describe("Minesweeper UI Integration", () => {
  beforeEach(() => {
    document.body.innerHTML = `
            <div id="mines-grid"></div>
            <div id="mine-count"></div>
            <div id="timer"></div>
            <div id="difficulty-selector"></div>
        `;
  });

  test("Grid container exists", () => {
    expect(document.getElementById("mines-grid")).not.toBeNull();
  });
});
