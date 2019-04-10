import { getCanvasDimensions, addToStage, removeFromStage } from "./main.js";

var MESSAGE: createjs.Text;
var MESSAGE_CONTAINER: createjs.Container;
var MESSAGE_TIMEOUT: Utilities.Timeout;
var LOADING: createjs.Text;

/**
 * Initialize the module.
 */
export function init() {
    const canvas = getCanvasDimensions();
    const backgroundHeight = 40;

    // the text part
    MESSAGE = new createjs.Text("", "30px monospace");
    MESSAGE.textAlign = "center";
    MESSAGE.textBaseline = "middle";
    MESSAGE.x = 0;
    MESSAGE.y = backgroundHeight / 2;

    // the background color
    const background = new createjs.Shape();
    const g = background.graphics;

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

    // the loading message
    LOADING = new createjs.Text("", "30px monospace");
    LOADING.textAlign = "center";
    LOADING.x = canvas.width / 2;
    LOADING.y = canvas.height / 2;
}

/**
 * Show a message in the game canvas for a certain duration before it is hidden.
 */
export function show(text: string, timeout: number, callback?: () => void) {
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
