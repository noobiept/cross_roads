import * as GameMenu from "./game_menu.js";
import * as Options from "./options.js";
import * as HighScore from "./high_score.js";
import * as Keyboard from "./keyboard.js";
import * as Music from "./music.js";
import * as Message from "./message.js";
import Level, { LevelInfo } from "./level.js";
import Player from "./player.js";
import { getAsset } from "./main.js";
import { timeToString } from "@drk4/utilities";

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

// the time since the game started (in seconds), which is the score (the lower the better)
// it's counted in the game loop, so it stops with the game (while the page is hidden for example)
let GAME_TIME = 0;
let TIMER_ELEMENT: HTMLElement;
let SHOWN_SECONDS = -1; // the time shown in the timer element

/**
 * Initial load of the game. Only call it once at the start.
 */
export function init() {
    TIMER_ELEMENT = GameMenu.getTimerElement();

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

    Keyboard.clearKeysHeld();
    GameMenu.toggleHelpSection(true);

    CURRENT_LEVEL = 1;
}

/**
 * Load the first level, and configure the player, etc.
 */
export function loadInitialLevel() {
    const first = getAsset("level_1") as LevelInfo;

    PLAYER = new Player();
    LEVEL = new Level({
        info: first,
        player: PLAYER,
    });
    PLAYER.bringToTop();

    CURRENT_LEVEL = 1;
    GAME_TIME = 0;
    updateTimerElement();

    GameMenu.startGame(CURRENT_LEVEL, PLAYER.getCurrentLives());
    Message.show("Level " + CURRENT_LEVEL, 2000);
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

    const next = "level_" + CURRENT_LEVEL;
    // there's no file for the level after the last one
    const levelInfo = getAsset(next) as LevelInfo | undefined;

    if (levelInfo) {
        LEVEL = new Level({
            info: levelInfo,
            player: PLAYER,
        });
        GameMenu.setLevel(CURRENT_LEVEL);

        PLAYER.getNewRandomShape();
        PLAYER.bringToTop();

        Message.show("Level " + CURRENT_LEVEL, 2000);
    } else {
        const time = getTimeSeconds();

        HighScore.add(time);
        clear();

        Message.show(
            "You Win! " + timeToString({ time: time * 1000 }),
            2000,
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
    // the time only counts while playing (not during the message at the end of a game)
    if (PLAYER) {
        GAME_TIME += deltaTime;
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
    return Math.floor(GAME_TIME);
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
