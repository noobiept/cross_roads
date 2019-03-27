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

export function init(onInitialInput?: (() => void)[]) {
    window.addEventListener("keydown", handleKeyDown, false);
    window.addEventListener("keyup", handleKeyUp, false);

    if (onInitialInput) {
        INITIAL_USER_INPUT_CALLBACKS = onInitialInput;
    }
}

export function clearKeysHeld() {
    KEYS_HELD.up = false;
    KEYS_HELD.down = false;
    KEYS_HELD.left = false;
    KEYS_HELD.right = false;
}

function handleKeyDown(event: KeyboardEvent) {
    if (!GOT_INITIAL_USER_INPUT) {
        handleInitialInput();
    }

    switch (event.keyCode) {
        case Utilities.KEY_CODE.a:
        case Utilities.KEY_CODE.leftArrow:
            KEYS_HELD.left = true;
            break;

        case Utilities.KEY_CODE.d:
        case Utilities.KEY_CODE.rightArrow:
            KEYS_HELD.right = true;
            break;

        case Utilities.KEY_CODE.w:
        case Utilities.KEY_CODE.upArrow:
            KEYS_HELD.up = true;
            break;

        case Utilities.KEY_CODE.s:
        case Utilities.KEY_CODE.downArrow:
            KEYS_HELD.down = true;
            break;
    }
}

function handleKeyUp(event: KeyboardEvent) {
    switch (event.keyCode) {
        case Utilities.KEY_CODE.a:
        case Utilities.KEY_CODE.leftArrow:
            KEYS_HELD.left = false;
            break;

        case Utilities.KEY_CODE.d:
        case Utilities.KEY_CODE.rightArrow:
            KEYS_HELD.right = false;
            break;

        case Utilities.KEY_CODE.w:
        case Utilities.KEY_CODE.upArrow:
            KEYS_HELD.up = false;
            break;

        case Utilities.KEY_CODE.s:
        case Utilities.KEY_CODE.downArrow:
            KEYS_HELD.down = false;
            break;
    }
}

function handleInitialInput() {
    for (let a = 0; a < INITIAL_USER_INPUT_CALLBACKS.length; a++) {
        INITIAL_USER_INPUT_CALLBACKS[a]();
    }

    GOT_INITIAL_USER_INPUT = true;
}
