import { expect, test, describe, beforeEach } from "vitest";

describe("Chess UI Integration", () => {
  beforeEach(() => {
    document.body.innerHTML = `
            <div id="chess-board"></div>
            <div id="current-player"></div>
            <div id="captured-pieces"></div>
            <div id="status"></div>
        `;
  });

  test("Board container exists", () => {
    expect(document.getElementById("chess-board")).not.toBeNull();
  });
});
