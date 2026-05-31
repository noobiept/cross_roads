import {
    getCanvasDimensions,
    addToStage,
    removeFromStage,
    bringToTop,
} from "./main.js";
import { Timeout, isFunction } from "@drk4/utilities";
import * as Engine from "@drk4/game-engine";

let MESSAGE: Engine.Text;
let MESSAGE_CONTAINER: Engine.Container;
let MESSAGE_TIMEOUT: Timeout;
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

    // the timeout that will clear the message
    MESSAGE_TIMEOUT = new Timeout();

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
 */
export function show(text: string, timeout: number, callback?: () => void) {
    MESSAGE.text = text;
    MESSAGE_CONTAINER.visible = true;

    // bring it to the front so that it stays on top of other elements (z-index)
    bringToTop(MESSAGE_CONTAINER);

    MESSAGE_TIMEOUT.start(function () {
        MESSAGE_CONTAINER.visible = false;

        if (isFunction(callback)) {
            callback!();
        }
    }, timeout);
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
 * Remove the loading message.
 */
export function removeLoading() {
    removeFromStage(LOADING);
}
