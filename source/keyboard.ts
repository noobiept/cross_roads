// keys state (being pressed or not)
export var KEYS_HELD = {
    up: false,
    down: false,
    left: false,
    right: false,
};

// tells us if the user has started playing the game yet or not
// some code can only run after some user input (like the music)
let GOT_INITIAL_USER_INPUT = false;
let INITIAL_USER_INPUT_CALLBACKS: (() => void)[] = [];

/**
 * Initialize the module, called at the start.
 */
export function init(onInitialInput?: (() => void)[]) {
    window.addEventListener("keydown", handleKeyDown, false);
    window.addEventListener("keyup", handleKeyUp, false);

    if (onInitialInput) {
        INITIAL_USER_INPUT_CALLBACKS = onInitialInput;
    }
}

/**
 * Reset the 'keys held' state.
 */
export function clearKeysHeld() {
    KEYS_HELD.up = false;
    KEYS_HELD.down = false;
    KEYS_HELD.left = false;
    KEYS_HELD.right = false;
}

/**
 * `keydown` event listener.
 * Detect when we have any initial input.
 * Also keep track of which keys are being held.
 */
function handleKeyDown(event: KeyboardEvent) {
    if (!GOT_INITIAL_USER_INPUT) {
        handleInitialInput();
    }

    switch (event.code) {
        case "KeyA":
        case "ArrowLeft":
            KEYS_HELD.left = true;
            break;

        case "KeyD":
        case "ArrowRight":
            KEYS_HELD.right = true;
            break;

        case "KeyW":
        case "ArrowUp":
            KEYS_HELD.up = true;
            break;

        case "KeyS":
        case "ArrowDown":
            KEYS_HELD.down = true;
            break;
    }
}

/**
 * `keyup` event listener.
 * Detect when a certain key stops being held.
 */
function handleKeyUp(event: KeyboardEvent) {
    switch (event.code) {
        case "KeyA":
        case "ArrowLeft":
            KEYS_HELD.left = false;
            break;

        case "KeyD":
        case "ArrowRight":
            KEYS_HELD.right = false;
            break;

        case "KeyW":
        case "ArrowUp":
            KEYS_HELD.up = false;
            break;

        case "KeyS":
        case "ArrowDown":
            KEYS_HELD.down = false;
            break;
    }
}

/**
 * Call the associated functions when an initial input occurs.
 */
function handleInitialInput() {
    for (let a = 0; a < INITIAL_USER_INPUT_CALLBACKS.length; a++) {
        INITIAL_USER_INPUT_CALLBACKS[a]();
    }

    GOT_INITIAL_USER_INPUT = true;
}
