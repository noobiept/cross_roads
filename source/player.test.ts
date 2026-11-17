import { describe, expect, test, vi } from "vitest";
import { keyDown, keyUp, startGame } from "../tests/helpers.js";

vi.mock("./main.js", () => import("../tests/fake_main.js"));

const RATES = [1 / 30, 1 / 60, 1 / 144];

const SPEED = 122; // pixels per second, while a key is held
const GLIDE = 7; // pixels it keeps moving after the key is released

describe("the player", () => {
    test.each(RATES)(
        "moves the same at any update rate (updating every %f seconds)",
        async (deltaTime) => {
            const game = await startGame();
            const player = game.player();
            const start = player.top;

            keyDown("ArrowUp");
            game.run(0.5, deltaTime);

            const atRelease = player.top;
            expect(start - atRelease).toBeCloseTo(SPEED * 0.5, 6);

            keyUp("ArrowUp");
            game.run(0.5, deltaTime);

            expect(atRelease - player.top).toBeCloseTo(GLIDE, 6);
        }
    );

    test.each(RATES)(
        "moves with a quick tap, released before the next update (updating every %f seconds)",
        async (deltaTime) => {
            const game = await startGame();
            const player = game.player();
            const start = player.left;

            keyDown("KeyD");
            keyUp("KeyD");
            game.run(0.5, deltaTime);

            expect(player.left - start).toBeCloseTo(
                SPEED * deltaTime + GLIDE,
                6
            );
        }
    );

    test("stops at the edges of the canvas", async () => {
        const game = await startGame();
        const player = game.player();

        keyDown("ArrowLeft");
        keyDown("ArrowUp");
        game.run(5, 1 / 60);

        expect(player.left).toBe(0);
        expect(player.top).toBe(0);
    });
});
