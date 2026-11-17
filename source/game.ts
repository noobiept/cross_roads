import * as GameMenu from "./game_menu.js";
import * as Options from "./options.js";
import * as HighScore from "./high_score.js";
import * as Music from "./music.js";
import * as Message from "./message.js";
import Level from "./level.js";
import Player from "./player.js";
import { getLevelInfo } from "./main.js";
import { timeToString } from "@drk4/utilities";
import * as Engine from "@drk4/game-engine";

export interface GameElement {
    getX(): number;
    getY(): number;
    getWidth(): number;
    getHeight(): number;
    clear(): void;
    positionIn(position: CanvasPosition): void;
}

export interface CanvasPosition {
    x: number;
    y: number;
}

let PLAYER: Player | null = null;
let LEVEL: Level | null = null;
let CURRENT_LEVEL = 1;

// the time since the game started, which is the score (the lower the better)
// it's game time, so it stops with the game (while the page is hidden for example)
let STOPWATCH: Engine.Stopwatch;
let TIMER_ELEMENT: HTMLElement;
let SHOWN_SECONDS = -1; // the time shown in the timer element

/**
 * Initial load of the game. Only call it once at the start.
 */
export function init() {
    TIMER_ELEMENT = GameMenu.getTimerElement();
    STOPWATCH = new Engine.Stopwatch();

    GameMenu.show();
}

/**
 * Restart the game starting from the first level.
 */
export function restart() {
    clear();
    loadInitialLevel();
}

/**
 * Clear the game state.
 */
export function clear() {
    if (LEVEL) {
        LEVEL.clear();
        LEVEL = null;
    }

    if (PLAYER) {
        PLAYER.clear();
        PLAYER = null;
    }

    STOPWATCH.stop();
    GameMenu.toggleHelpSection(true);

    CURRENT_LEVEL = 1;
}

/**
 * Load the first level, and configure the player, etc.
 */
export function loadInitialLevel() {
    const first = getLevelInfo(1)!;

    PLAYER = new Player();
    LEVEL = new Level({
        info: first,
        player: PLAYER,
    });
    PLAYER.bringToTop();

    CURRENT_LEVEL = 1;
    STOPWATCH.reset();
    STOPWATCH.start();
    updateTimerElement();

    GameMenu.startGame(CURRENT_LEVEL, PLAYER.getCurrentLives());
    Message.show("Level " + CURRENT_LEVEL, 2);
}

/**
 * @param levelPosition - The level number to load. Otherwise it loads the next level.
 */
export function nextLevel(levelPosition?: number) {
    if (!PLAYER) {
        throw new Error(
            "Trying to load the next level without a player defined."
        );
    }

    if (LEVEL) {
        LEVEL.clear();
    }
    LEVEL = null;

    if (typeof levelPosition === "undefined") {
        CURRENT_LEVEL++;
    } else {
        CURRENT_LEVEL = levelPosition;
    }

    // there's no file for the level after the last one
    const levelInfo = getLevelInfo(CURRENT_LEVEL);

    if (levelInfo) {
        LEVEL = new Level({
            info: levelInfo,
            player: PLAYER,
        });
        GameMenu.setLevel(CURRENT_LEVEL);

        PLAYER.getNewRandomShape();
        PLAYER.bringToTop();

        Message.show("Level " + CURRENT_LEVEL, 2);
    } else {
        const time = getTimeSeconds();

        HighScore.add(time);
        clear();

        Message.show(
            "You Win! " + timeToString({ time: time * 1000 }),
            2,
            function () {
                loadInitialLevel();
            }
        );
    }
}

/**
 * Update the level and player state. Its called continuously on the game loop.
 *
 * @param deltaTime Time elapsed since the last update (in seconds).
 */
export function tick(deltaTime: number) {
    // while a game is running (the game loop starts before the game, while the files are loading)
    if (PLAYER) {
        updateTimerElement();
    }

    if (LEVEL) {
        LEVEL.tick(deltaTime);
    }

    if (PLAYER) {
        PLAYER.tick(deltaTime);
    }
}

/**
 * The time since the game started, in whole seconds (as shown in the game menu).
 */
function getTimeSeconds() {
    return Math.floor(STOPWATCH.getTime());
}

/**
 * Show the current time in the game menu.
 * It's called on every update, so it only changes the page when the shown value changes.
 */
function updateTimerElement() {
    const seconds = getTimeSeconds();

    if (seconds !== SHOWN_SECONDS) {
        SHOWN_SECONDS = seconds;
        TIMER_ELEMENT.textContent = timeToString({ time: seconds * 1000 });
    }
}

/**
 * Get the current level.
 */
export function getCurrentLevel() {
    return CURRENT_LEVEL;
}

/**
 * Change the music state.
 */
export function setMusicState(onOff: boolean) {
    Options.setMusicState(onOff);

    if (onOff === true) {
        Music.play();
    } else {
        Music.stop();
    }
}

/**
 * The origin point of the game elements is on the top-left corner.
 * So if we want 2 elements that have different width/height to be centered, we need to calculate an adjusted x/y position.
 */
export function centerElement(reference: GameElement, element: GameElement) {
    const diffWidth = element.getWidth() - reference.getWidth();
    const diffHeight = element.getHeight() - reference.getHeight();

    return {
        x: reference.getX() - diffWidth / 2,
        y: reference.getY() - diffHeight / 2,
    };
}
