import { expect, test, describe, beforeEach } from "vitest";

describe("Gomoku UI Integration", () => {
  beforeEach(() => {
    document.body.innerHTML = `
            <div id="board"></div>
            <div id="status"></div>
            <div id="timer"></div>
            <div id="moves"></div>
        `;
  });

  test("Basic DOM structure for board exists", () => {
    const board = document.getElementById("board");
    expect(board).not.toBeNull();
  });
});
