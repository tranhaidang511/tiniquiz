import { expect, test, describe, beforeEach } from "vitest";

describe("Mancala UI Integration", () => {
  beforeEach(() => {
    document.body.innerHTML = `
            <div id="mancala-board"></div>
            <div id="current-player"></div>
            <div id="status"></div>
        `;
  });

  test("Board container exists", () => {
    expect(document.getElementById("mancala-board")).not.toBeNull();
  });
});
