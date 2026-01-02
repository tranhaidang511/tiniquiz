import { expect, test, describe, beforeEach } from "vitest";

describe("Xiangqi UI Integration", () => {
  beforeEach(() => {
    document.body.innerHTML = `
            <div id="xiangqi-board"></div>
            <div id="current-player"></div>
            <div id="game-status"></div>
        `;
  });

  test("Board container exists", () => {
    expect(document.getElementById("xiangqi-board")).not.toBeNull();
  });
});
