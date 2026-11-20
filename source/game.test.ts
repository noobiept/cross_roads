import { describe, expect, test, vi } from "vitest";
import { timeToString } from "@drk4/utilities";
import { startGame } from "../tests/helpers.js";
import { SavedData } from "./app_storage.js";

vi.mock("./main.js", () => import("../tests/fake_main.js"));

type Game = Awaited<ReturnType<typeof startGame>>;

/**
 * Put the player on a car that is on the road, and update the game once (so the level sees it).
 */
function getHit(game: Game) {
    const car = game.cars().find((car) => car.left > 50 && car.left < 500)!;
    const player = game.player();

    player.x = car.x;
    player.y = car.y;

    game.Engine.step(1 / 60);
}

describe("a game", () => {
    test("starts on the first level", async () => {
        const game = await startGame();

        expect(game.menu("Level")).toBe("1");
        expect(game.menu("Lives")).toBe("10");
        expect(game.message()).toBe("Level 1");

        game.run(1, 1 / 60);

        expect(game.menu("Timer")).toBe("1 second");
    });

    test("the timer shows the whole seconds of game time", async () => {
        const game = await startGame();

        // the steps of 1/60 of a second don't add up exactly to the whole seconds
        for (let seconds = 1; seconds <= 60; seconds++) {
            game.run(1, 1 / 60);

            expect(game.menu("Timer")).toBe(
                timeToString({ time: seconds * 1000 })
            );
        }
    });

    test("the player goes to the next level after crossing the road", async () => {
        const game = await startGame();

        game.player().top = 590;
        game.Engine.step(1 / 60);

        expect(game.menu("Level")).toBe("2");
        expect(game.message()).toBe("Level 2");
        // back at the start, above the road
        expect(game.player().top).toBeLessThan(300);
    });

    test("finishing the last level shows the time and saves it, then a new game starts", async () => {
        const game = await startGame();

        game.run(3.5, 1 / 60);
        game.Game.nextLevel(20);
        game.player().top = 590;
        game.Engine.step(1 / 60);

        expect(game.message()).toBe("You Win! 3 seconds");
        expect(localStorage.getItem("cross_roads_high_score")).toBe("[3]");
        expect(document.querySelector("#HighScore li.value")!.textContent).toBe(
            "3 seconds"
        );

        // the time doesn't count after the game ended
        game.run(1.5, 1 / 60);
        expect(game.menu("Timer")).toBe("3 seconds");

        game.run(0.6, 1 / 60);
        expect(game.message()).toBe("Level 1");
        expect(game.menu("Level")).toBe("1");
        expect(game.menu("Timer")).toBe("0 seconds");
    });

    test("a car costs a life, and takes the player back to the start", async () => {
        const game = await startGame();
        const startX = game.player().x;
        const startY = game.player().y;

        game.run(0.5, 1 / 60);
        getHit(game);

        expect(game.menu("Lives")).toBe("9");
        expect(game.message()).toBe("Collision!");
        expect(game.player().x).toBe(startX);
        expect(game.player().y).toBe(startY);

        // the explosion is taken out once its animation ends
        const explosions = () =>
            game.Engine.getCanvas()
                .getAllChildren()
                .filter((element) => element instanceof game.Engine.Sprite);

        expect(explosions()).toHaveLength(1);
        game.run(0.5, 1 / 60);
        expect(explosions()).toHaveLength(0);
    });

    test("the game ends without lives, then a new game starts", async () => {
        const game = await startGame();

        for (let a = 0; a < 10; a++) {
            getHit(game);
        }

        expect(game.menu("Lives")).toBe("0");
        expect(game.message()).toBe("No more lives, you loose!");
        expect(game.cars()).toHaveLength(0);

        game.run(2.1, 1 / 60);

        expect(game.menu("Lives")).toBe("10");
        expect(game.menu("Level")).toBe("1");
        expect(game.message()).toBe("Level 1");
    });
});

describe("the saved data", () => {
    test("corrupted data is ignored", async () => {
        const AppStorage = await import("./app_storage.js");

        localStorage.setItem("cross_roads_high_score", "[3, 5");
        localStorage.setItem("cross_roads_options", "{music_state");

        let saved: SavedData | undefined;

        AppStorage.getData(
            ["cross_roads_high_score", "cross_roads_options"],
            (data) => {
                saved = data;
            }
        );

        expect(saved).toEqual({
            cross_roads_high_score: null,
            cross_roads_options: null,
        });
    });

    test("only the valid values are used", async () => {
        // modules that weren't initialized yet (they're initialized once)
        vi.resetModules();
        document.body.innerHTML = '<ul id="HighScore"></ul>';

        const Options = await import("./options.js");
        const HighScore = await import("./high_score.js");

        Options.load({ music_state: "yes" });
        expect(Options.getMusicState()).toBe(true);
        Options.load({ music_state: false });
        expect(Options.getMusicState()).toBe(false);

        HighScore.init([50, "x", null, -1, 7, Infinity, 30]);

        const scores = [...document.querySelectorAll("#HighScore li")].map(
            (li) => li.textContent
        );
        expect(scores).toEqual([
            "7 seconds",
            "30 seconds",
            "50 seconds",
            "-",
            "-",
        ]);
    });
});
