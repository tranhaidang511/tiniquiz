import { expect, test, describe, beforeEach } from "vitest";

describe("Go UI Integration", () => {
  beforeEach(() => {
    document.body.innerHTML = `
            <div id="go-board"></div>
            <div id="black-score"></div>
            <div id="white-score"></div>
            <div id="game-status"></div>
        `;
  });

  test("Board container exists", () => {
    expect(document.getElementById("go-board")).not.toBeNull();
  });
});
