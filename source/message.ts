import {
    getCanvasDimensions,
    addToStage,
    removeFromStage,
    bringToTop,
} from "./main.js";
import * as Engine from "@drk4/game-engine";

let MESSAGE: Engine.Text;
let MESSAGE_CONTAINER: Engine.Container;
let MESSAGE_TIMEOUT: (() => void) | null = null; // hides the current message (it's in the game loop)
let LOADING: Engine.Text;

/**
 * Initialize the module.
 */
export function init() {
    const canvas = getCanvasDimensions();
    const backgroundHeight = 40;

    // the text part (centered within the banner)
    MESSAGE = new Engine.Text({
        text: "",
        fontSize: 30,
        fontFamily: "monospace",
        textAlign: "center",
        textBaseline: "middle",
    });
    MESSAGE.x = 0;
    MESSAGE.y = 0;

    // the background color
    const background = new Engine.Rectangle({
        x: 0,
        y: 0,
        width: canvas.width,
        height: backgroundHeight,
        color: "lightblue",
    });

    // the container, centered horizontally and sitting at the top of the canvas
    MESSAGE_CONTAINER = new Engine.Container({
        children: [background, MESSAGE],
    });

    MESSAGE_CONTAINER.visible = false;
    MESSAGE_CONTAINER.x = canvas.width / 2;
    MESSAGE_CONTAINER.y = backgroundHeight / 2;

    addToStage(MESSAGE_CONTAINER);

    // the loading message
    LOADING = new Engine.Text({
        text: "",
        fontSize: 30,
        fontFamily: "monospace",
        textAlign: "center",
    });
    LOADING.x = canvas.width / 2;
    LOADING.y = canvas.height / 2;
}

/**
 * Show a message in the game canvas for a certain duration before it is hidden.
 * The duration is counted in the game loop, so it pauses with the game (while the page is hidden
 * for example), and so does the `callback` (called once it's hidden).
 *
 * @param timeout How long the message is shown (in milliseconds).
 */
export function show(text: string, timeout: number, callback?: () => void) {
    MESSAGE.text = text;
    MESSAGE_CONTAINER.visible = true;

    // bring it to the front so that it stays on top of other elements (z-index)
    bringToTop(MESSAGE_CONTAINER);

    // it replaces the previous message
    if (MESSAGE_TIMEOUT) {
        Engine.removeFromGameLoop(MESSAGE_TIMEOUT);
    }

    const hide = () => {
        MESSAGE_TIMEOUT = null;
        MESSAGE_CONTAINER.visible = false;
        callback?.();
    };

    MESSAGE_TIMEOUT = hide;
    Engine.addToGameLoop(hide, { delay: timeout / 1000, interval: false });
}

/**
 * Show a loading message in the center of the canvas.
 */
export function addLoading() {
    addToStage(LOADING);
}

/**
 * Update the loading progress value.
 */
export function updateLoading(progress: number) {
    LOADING.text = "Loading.. " + progress + "%";
}

/**
 * Replace the loading message with an error (the game can't start without its files).
 */
export function loadingFailed() {
    LOADING.text = "Failed to load the game.";
}

/**
 * Remove the loading message.
 */
export function removeLoading() {
    removeFromStage(LOADING);
}
