import { expect, test, describe, beforeEach, vi } from "vitest";
import { Localization } from "../../common/Localization";
import en from "../i18n/en";

// Mock DOM since main.ts interacts with it heavily
describe("Sliding Puzzle UI Integration", () => {
  beforeEach(() => {
    document.body.innerHTML = `
            <div id="game-title"></div>
            <div id="menu-view"></div>
            <div id="game-view" class="hidden"></div>
            <div id="result-view" class="hidden"></div>
            <div id="puzzle-board"></div>
            <div id="menu-title"></div>
            <div id="label-board-size"></div>
            <button id="start-btn"></button>
            <div id="label-time"></div>
            <div id="time-display"></div>
            <div id="label-moves"></div>
            <div id="moves-display"></div>
            <button id="new-game-btn"></button>
            <div id="result-title"></div>
            <div id="result-message"></div>
            <div id="label-total-time"></div>
            <div id="final-time"></div>
            <div id="label-total-moves"></div>
            <div id="final-moves"></div>
            <button id="play-again-btn"></button>
            <div id="high-scores-title"></div>
            <div id="th-rank"></div>
            <div id="th-moves"></div>
            <div id="th-time"></div>
            <div id="th-date"></div>
            <div id="reference-label"></div>
            <div id="label-puzzle-type"></div>
            <button id="btn-type-numbers"></button>
            <button id="btn-type-image"></button>
            <div id="label-show-numbers"></div>
            <div id="reference-board"></div>
            <input type="checkbox" id="show-numbers-check" />
        `;
  });

  test("Localization should update UI text", () => {
    const localization = new Localization({ en }, "en");
    // Simple verification that we can get text
    expect(localization.getUIText("gameTitle")).toBe(en.ui.gameTitle);
  });

  // Note: Testing actual main.ts requires complex mocking of imports
  // because it executes immediately. Usually, we'd refactor main.ts
  // to export an init function, but for now we'll focus on the logic
  // and basic DOM availability.
});
