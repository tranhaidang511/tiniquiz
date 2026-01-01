import { expect, test, describe, beforeEach } from "vitest";

describe("Geogame UI Integration", () => {
  beforeEach(() => {
    document.body.innerHTML = `
            <div id="geogame-container"></div>
            <div id="question-text"></div>
            <div id="choices-container"></div>
            <div id="score-display"></div>
            <div id="timer-display"></div>
        `;
  });

  test("Container exists", () => {
    expect(document.getElementById("geogame-container")).not.toBeNull();
  });
});
