import * as GameMenu from "./game_menu.js";
import * as Options from "./options.js";
import * as HighScore from "./high_score.js";
import * as Keyboard from "./keyboard.js";
import * as Music from "./music.js";
import * as Message from "./message.js";
import Level, { LevelInfo } from "./level.js";
import Player from "./player.js";
import { getAsset } from "./main.js";
import { Timer } from "@drk4/utilities";

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

var TIMER: Timer;
var PLAYER: Player | null = null;
var LEVEL: Level | null = null;
var CURRENT_LEVEL = 1;

/**
 * Initial load of the game. Only call it once at the start.
 */
export function init() {
    var timerElement = GameMenu.getTimerElement();
    TIMER = new Timer({
        updateElement: {
            element: timerElement,
        },
    });

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
    let first = getAsset("level_1") as LevelInfo;

    PLAYER = new Player();
    LEVEL = new Level({
        info: first,
        player: PLAYER,
    });
    PLAYER.bringToTop();

    CURRENT_LEVEL = 1;
    TIMER.restart();

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

    var next = "level_" + CURRENT_LEVEL;

    var levelInfo = getAsset(next) as LevelInfo;

    if (levelInfo !== null) {
        LEVEL = new Level({
            info: levelInfo,
            player: PLAYER,
        });
        GameMenu.setLevel(CURRENT_LEVEL);

        PLAYER.getNewRandomShape();
        PLAYER.bringToTop();

        Message.show("Level " + CURRENT_LEVEL, 2000);
    } else {
        HighScore.add(TIMER.getTimeSeconds());
        clear();

        Message.show("You Win! " + TIMER.getTimeString(), 2000, function() {
            loadInitialLevel();
        });
    }
}

/**
 * Update the level and player state. Its called continuously at a given interval.
 */
export function tick(event: createjs.TickerEvent) {
    if (LEVEL) {
        LEVEL.tick(event);
    }

    if (PLAYER) {
        PLAYER.tick(event);
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
