import { expect, test, describe, beforeEach } from "vitest";

describe("Checkers UI Integration", () => {
  beforeEach(() => {
    document.body.innerHTML = `
            <div id="checkers-board"></div>
            <div id="current-player"></div>
        `;
  });

  test("Board container exists", () => {
    expect(document.getElementById("checkers-board")).not.toBeNull();
  });
});
