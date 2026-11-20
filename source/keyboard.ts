import * as Engine from "@drk4/game-engine";

export interface DirectionKeys {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

let CONTROLS: Engine.Keyboard<keyof DirectionKeys>;

/**
 * Initialize the module, called at the start.
 *
 * @param onInitialInput Some code can only run after some user input (like the music), so it's
 *                       called on the key presses until it returns `true` (it may not be ready on
 *                       the first one, while the files are loading).
 */
export function init(onInitialInput: () => boolean) {
    CONTROLS = new Engine.Keyboard({
        up: ["ArrowUp", "KeyW"],
        down: ["ArrowDown", "KeyS"],
        left: ["ArrowLeft", "KeyA"],
        right: ["ArrowRight", "KeyD"],
    });

    const onKeyDown = () => {
        if (onInitialInput()) {
            window.removeEventListener("keydown", onKeyDown);
        }
    };

    window.addEventListener("keydown", onKeyDown);
}

/**
 * The directions to move in this update: the keys being held, and the ones pressed since the last
 * update (so a quick tap, released before the next update, still moves the player).
 */
export function getDirections(): DirectionKeys {
    const direction = (key: keyof DirectionKeys) =>
        CONTROLS.isHeld(key) || CONTROLS.wasPressed(key);

    return {
        up: direction("up"),
        down: direction("down"),
        left: direction("left"),
        right: direction("right"),
    };
}
