import { getCanvasDimensions, addToStage } from "./main.js";

var MESSAGE: createjs.Text;
var MESSAGE_CONTAINER: createjs.Container;
var MESSAGE_TIMEOUT: Utilities.Timeout;

/**
 * Initialize the module.
 */
export function init() {
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
