import { vi } from "vitest";
import page from "../index.html?raw";
import { CAR_WIDTH, PLAYER_SIZE } from "./fake_main.js";

/**
 * jsdom doesn't implement the canvas 2d context, so give the canvas elements one that does nothing.
 * `measureText()` gives 10 pixels per character.
 */
function stubCanvasContext() {
    const context = new Proxy(
        {},
        {
            get(_target, property) {
                if (property === "measureText") {
                    return (text: string) => ({ width: text.length * 10 });
                }

                return () => {};
            },
            set() {
                return true;
            },
        }
    );

    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
        () => context as never
    );
}

/**
 * Start a new game, like `source/main.ts` does once the files are loaded (with fresh modules, so the
 * tests don't share any state), with the game loop stopped: update it with `step()`.
 * The test file has to replace `main.ts` first: `vi.mock("./main.js", () => import("../tests/fake_main.js"));`
 */
export async function startGame() {
    vi.resetModules();
    vi.restoreAllMocks();
    stubCanvasContext();

    // the animation frames aren't used (the game is updated by hand)
    vi.stubGlobal("requestAnimationFrame", () => 1);
    vi.stubGlobal("cancelAnimationFrame", () => {});

    localStorage.clear();
    document.body.innerHTML = new DOMParser().parseFromString(
        page,
        "text/html"
    ).body.innerHTML;

    // the engine is a package, so `vi.resetModules()` doesn't load it again: take out what the
    // previous game left in it (`init()` keeps the game loop callbacks and the tweens, and the keys
    // are shared by all the keyboards)
    const Engine = await import("@drk4/game-engine");

    Engine.removeAllCallbacks();
    Engine.Tween.removeAll();
    window.dispatchEvent(new Event("blur"));

    const Options = await import("../source/options.js");
    const GameMenu = await import("../source/game_menu.js");
    const HighScore = await import("../source/high_score.js");
    const Keyboard = await import("../source/keyboard.js");
    const Message = await import("../source/message.js");
    const Music = await import("../source/music.js");
    const Game = await import("../source/game.js");

    Engine.init({
        container: document.getElementById("CanvasContainer")!,
        width: 600,
        height: 600,
    });
    Engine.stopGameLoop();

    Options.load(null);
    GameMenu.init();
    HighScore.init(null);
    Keyboard.init(Music.play);
    Message.init();

    Engine.addToGameLoop(Game.tick);
    Game.init();
    Game.loadInitialLevel();

    const canvasElements = () => Engine.getCanvas().getAllChildren();

    return {
        Engine,
        Game,

        /**
         * Update the game for some time, in steps of `deltaTime` (in seconds).
         */
        run(seconds: number, deltaTime: number) {
            const steps = Math.round(seconds / deltaTime);

            for (let a = 0; a < steps; a++) {
                Engine.step(deltaTime);
            }
        },

        /**
         * The player's element (the only one of its size).
         */
        player() {
            const player = canvasElements().find(
                (element) => element.width === PLAYER_SIZE
            );

            if (!player) {
                throw new Error("There's no player.");
            }

            return player;
        },

        /**
         * The cars' elements.
         */
        cars() {
            return canvasElements().filter(
                (element) => element.width === CAR_WIDTH
            );
        },

        /**
         * The text of the message shown at the top of the canvas (`null` when it's hidden).
         */
        message() {
            for (const element of canvasElements()) {
                if (element instanceof Engine.Container && element.visible) {
                    const text = element
                        .getAllChildren()
                        .find((child) => child instanceof Engine.Text);

                    if (text instanceof Engine.Text) {
                        return text.text;
                    }
                }
            }

            return null;
        },

        /**
         * A value shown in the game menu.
         */
        menu(id: "Lives" | "Level" | "Timer") {
            return document.querySelector(`#${id} span`)!.textContent;
        },
    };
}

/**
 * Press a key (a `KeyboardEvent.code`).
 */
export function keyDown(code: string) {
    window.dispatchEvent(new KeyboardEvent("keydown", { code }));
}

/**
 * Release a key (a `KeyboardEvent.code`).
 */
export function keyUp(code: string) {
    window.dispatchEvent(new KeyboardEvent("keyup", { code }));
}
