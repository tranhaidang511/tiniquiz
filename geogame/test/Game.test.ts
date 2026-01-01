import { expect, test, describe, beforeEach } from "vitest";
import { Game } from "../Game";

describe("Geogame Logic", () => {
  let game: Game;

  beforeEach(() => {
    game = new Game();
  });

  test("Initial state is MENU", () => {
    expect(game.getState()).toBe("MENU");
  });

  test("Game starts with questions", () => {
    game.start(5);
    expect(game.getState()).toBe("PLAYING");
    const score = game.getScore();
    expect(score.total).toBe(5);
    expect(score.score).toBe(0);
  });

  test("Submitting answer updates score (correct)", () => {
    game.start(5);
    const question = (game as any).questions[0];
    const correctChoice = question.target;

    const isCorrect = game.submitAnswer(correctChoice);
    expect(isCorrect).toBe(true);
    expect(game.getScore().score).toBe(1);
  });

  test("Submitting answer updates score (incorrect)", () => {
    game.start(5);
    const question = (game as any).questions[0];
    const wrongChoice = question.choices.find((c: any) => c !== question.target);

    const isCorrect = game.submitAnswer(wrongChoice);
    expect(isCorrect).toBe(false);
    expect(game.getScore().score).toBe(0);
  });

  test("Next question proceeds through total", () => {
    game.start(2);
    game.submitAnswer((game as any).questions[0].target);
    game.nextQuestion();
    expect((game as any).currentQuestionIndex).toBe(1);

    game.submitAnswer((game as any).questions[1].target);
    game.nextQuestion();
    expect(game.getState()).toBe("RESULT");
  });
});
