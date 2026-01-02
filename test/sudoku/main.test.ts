import { expect, test, describe, beforeEach } from "vitest";

describe("Sudoku UI Integration", () => {
  beforeEach(() => {
    document.body.innerHTML = `
            <div id="sudoku-grid"></div>
            <div id="mistakes"></div>
            <div id="timer"></div>
            <div id="difficulty-selector"></div>
        `;
  });

  test("Grid container exists", () => {
    expect(document.getElementById("sudoku-grid")).not.toBeNull();
  });
});
