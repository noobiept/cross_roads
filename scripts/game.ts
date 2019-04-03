import * as GameMenu from "./game_menu.js";
import * as Options from "./options.js";
import * as HighScore from "./high_score.js";
import * as Keyboard from "./keyboard.js";
import * as Music from "./music.js";
import Level, { LevelInfo } from "./level.js";
import Player from "./player.js";
import { getCanvasDimensions, addToStage, getAsset } from "./main.js";

export interface GameElement {
    getX(): number;
    getY(): number;
    getWidth(): number;
    getHeight(): number;
}

var PLAYER: Player | null = null;
var LEVEL: Level | null = null;
var CURRENT_LEVEL = 1;

var MESSAGE: createjs.Text;
var MESSAGE_CONTAINER: createjs.Container;
var MESSAGE_TIMEOUT: Utilities.Timeout;

export function start() {
    initMessage();
    loadInitialLevel();

    GameMenu.show();
}

function initMessage() {
    const canvas = getCanvasDimensions();

    // the text part
    MESSAGE = new createjs.Text("", "30px monospace");
    MESSAGE.textAlign = "center";

    // the background color
    var background = new createjs.Shape();
    var backgroundHeight = 40;

    var g = background.graphics;

    g.beginFill("lightblue");
    g.drawRect(-canvas.width / 2, 0, canvas.width, backgroundHeight);
    g.endFill();

    // the container
    MESSAGE_CONTAINER = new createjs.Container();

    MESSAGE_CONTAINER.visible = false;
    MESSAGE_CONTAINER.addChild(background);
    MESSAGE_CONTAINER.addChild(MESSAGE);

    MESSAGE_CONTAINER.x = canvas.width / 2;
    MESSAGE_CONTAINER.y = 0;

    addToStage(MESSAGE_CONTAINER);

    // the timeout that will clear the message
    MESSAGE_TIMEOUT = new Utilities.Timeout();
}

export function restart() {
    clear();
    loadInitialLevel();
}

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

    CURRENT_LEVEL = 1;
}

export function loadInitialLevel() {
    let first = getAsset("level_1") as LevelInfo;

    PLAYER = new Player();
    LEVEL = new Level({
        info: first,
        player: PLAYER,
    });
    PLAYER.bringToTop();

    CURRENT_LEVEL = 1;

    GameMenu.startGame(CURRENT_LEVEL, PLAYER.lives);

    showMessage("Level " + CURRENT_LEVEL, 2000);
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

        showMessage("Level " + CURRENT_LEVEL, 2000);
    } else {
        var timer = GameMenu.getTimer();

        HighScore.add(timer.getTimeSeconds());
        clear();
        showMessage("You Win! " + timer.getTimeString(), 2000, function() {
            loadInitialLevel();
        });
    }
}

/**
 * Update the level and player state.
 */
export function tick(event: createjs.TickerEvent) {
    if (LEVEL) {
        LEVEL.tick(event);
    }

    if (PLAYER) {
        PLAYER.tick(event);
    }
}

export function getCurrentLevel() {
    return CURRENT_LEVEL;
}

export function showMessage(
    text: string,
    timeout: number,
    callback?: () => void
) {
    MESSAGE.text = text;
    MESSAGE_CONTAINER.visible = true;

    // re-add the element so that it stays on top of other elements (z-index)
    addToStage(MESSAGE_CONTAINER);

    MESSAGE_TIMEOUT.start(function() {
        MESSAGE_CONTAINER.visible = false;

        if (Utilities.isFunction(callback)) {
            callback!();
        }
    }, timeout);
}

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
