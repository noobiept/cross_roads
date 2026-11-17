import * as AppStorage from "./app_storage.js";
import * as Options from "./options.js";
import * as GameMenu from "./game_menu.js";
import * as HighScore from "./high_score.js";
import * as Keyboard from "./keyboard.js";
import * as Game from "./game.js";
import * as Music from "./music.js";
import * as Message from "./message.js";
import * as Engine from "@drk4/game-engine";
import { CarType, AllCarsInfo } from "./car.js";
import { LevelInfo } from "./level.js";

import "../css/style.css";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;

let PRELOAD: Engine.Preload;

window.onload = function () {
    AppStorage.getData(
        [
            "cross_roads_high_score",
            "cross_roads_options",
            "cross_roads_has_run_before",
        ],
        initApp
    );
};

/**
 * Initialize the application with the data we got from the storage.
 */
async function initApp(data: AppStorage.SavedData) {
    const container = document.getElementById("CanvasContainer")!;

    Engine.init({
        container: container,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
    });

    Options.load(data["cross_roads_options"]);
    GameMenu.init();
    HighScore.init(data["cross_roads_high_score"]);
    Keyboard.init([Music.play]);
    Message.init();

    const manifest: Engine.PreloadManifestEntry[] = [
        { id: "cars", path: "data/cars.json" },

        { id: "level_1", path: "data/levels/level1.json" },
        { id: "level_2", path: "data/levels/level2.json" },
        { id: "level_3", path: "data/levels/level3.json" },
        { id: "level_4", path: "data/levels/level4.json" },
        { id: "level_5", path: "data/levels/level5.json" },
        { id: "level_6", path: "data/levels/level6.json" },
        { id: "level_7", path: "data/levels/level7.json" },
        { id: "level_8", path: "data/levels/level8.json" },
        { id: "level_9", path: "data/levels/level9.json" },
        { id: "level_10", path: "data/levels/level10.json" },
        { id: "level_11", path: "data/levels/level11.json" },
        { id: "level_12", path: "data/levels/level12.json" },
        { id: "level_13", path: "data/levels/level13.json" },
        { id: "level_14", path: "data/levels/level14.json" },
        { id: "level_15", path: "data/levels/level15.json" },
        { id: "level_16", path: "data/levels/level16.json" },
        { id: "level_17", path: "data/levels/level17.json" },
        { id: "level_18", path: "data/levels/level18.json" },
        { id: "level_19", path: "data/levels/level19.json" },
        { id: "level_20", path: "data/levels/level20.json" },

        { id: "car_1", path: "images/car1.png" },
        { id: "car_2", path: "images/car2.png" },
        { id: "car_3", path: "images/car3.png" },
        { id: "car_4", path: "images/car4.png" },
        { id: "car_5", path: "images/car5.png" },
        { id: "car_6", path: "images/car6.png" },

        { id: "explosion", path: "images/explosion.png" },

        // the game can run without the music
        { id: "happy_tune", path: "music/happy_tune.ogg", optional: true },

        { id: "player_1", path: "images/player1.png" },
        { id: "player_2", path: "images/player2.png" },
        { id: "player_3", path: "images/player3.png" },
        { id: "player_4", path: "images/player4.png" },
        { id: "player_5", path: "images/player5.png" },
        { id: "player_6", path: "images/player6.png" },
        { id: "player_7", path: "images/player7.png" },
        { id: "player_8", path: "images/player8.png" },
    ];

    Engine.addToGameLoop(mainTick);
    Message.addLoading();

    PRELOAD = new Engine.Preload({ saveGlobal: false });
    PRELOAD.addEventListener("progress", function (progress: number) {
        // the engine dispatches progress as a 0-100 percentage already
        Message.updateLoading(progress | 0);
    });

    try {
        // it fails when a file that isn't optional fails to load
        await PRELOAD.loadManifest(manifest);
    } catch (error) {
        if (!(error instanceof Engine.PreloadError)) {
            throw error;
        }

        console.error("Failed to load: " + error.failedIds.join(", "));
        Message.loadingFailed();
        return;
    }

    Message.removeLoading();

    // show the help page on the first run of the game
    if (!data["cross_roads_has_run_before"]) {
        AppStorage.setData({ cross_roads_has_run_before: true });
        await GameMenu.openInitialHelpSection();
    }

    Game.init();
    Game.loadInitialLevel();
}

/**
 * Get the width/height of the canvas.
 */
export function getCanvasDimensions() {
    return {
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
    };
}

/**
 * Add an element to the stage (to be shown on the canvas).
 */
export function addToStage(element: Engine.Element) {
    Engine.addElement(element);
}

/**
 * Remove an element from the stage for good. It's destroyed (which also stops its tweens), so it
 * can't be added again.
 */
export function removeFromStage(element: Engine.Element) {
    element.destroy();
}

/**
 * Bring an element to the front, so it stays on top of the other elements.
 */
export function bringToTop(element: Engine.Element) {
    Engine.getCanvas().bringToFront(element);
}

/**
 * The game only starts once its files are loaded (except the optional ones), so a file that isn't
 * there is a mistake in the code (a wrong id).
 */
function loaded<T>(file: T | undefined, id: string): T {
    if (file === undefined) {
        throw new Error(`The file "${id}" wasn't loaded.`);
    }

    return file;
}

/**
 * Get a preloaded image.
 */
export function getImage(id: string) {
    return loaded(PRELOAD.getImage(id), id);
}

/**
 * Get a preloaded sound (`undefined` when it failed to load, or it's still loading).
 */
export function getAudio(id: string) {
    return PRELOAD.getAudio(id);
}

/**
 * Get the info of a level (`undefined` when there's no such level, after the last one).
 */
export function getLevelInfo(level: number) {
    return PRELOAD.getJson<LevelInfo>("level_" + level);
}

/**
 * Get the info a specific car type (to know the speed, width, etc).
 */
export function getCarInfo(type: CarType) {
    return loaded(PRELOAD.getJson<AllCarsInfo>("cars"), "cars")[type];
}

/**
 * The main game loop, calls other updates from here.
 *
 * @param deltaTime Time elapsed since the last update (in seconds).
 */
function mainTick(deltaTime: number) {
    Game.tick(deltaTime);
}
