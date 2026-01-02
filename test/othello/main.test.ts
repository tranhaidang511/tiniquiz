import { expect, test, describe, beforeEach } from "vitest";

describe("Othello UI Integration", () => {
  beforeEach(() => {
    document.body.innerHTML = `
            <div id="othello-board"></div>
            <div id="black-score"></div>
            <div id="white-score"></div>
        `;
  });

  test("Board container exists", () => {
    expect(document.getElementById("othello-board")).not.toBeNull();
  });
});
