export interface DirectionKeys {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}

type Direction = keyof DirectionKeys;

// keys state (being pressed or not)
const KEYS_HELD: DirectionKeys = {
    up: false,
    down: false,
    left: false,
    right: false,
};

// keys pressed since the last update (a quick tap can be released before the next update)
const KEYS_PRESSED: DirectionKeys = {
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

    // the keys released while the window doesn't have the focus don't get a `keyup` event here
    window.addEventListener("blur", clearKeysHeld, false);

    if (onInitialInput) {
        INITIAL_USER_INPUT_CALLBACKS = onInitialInput;
    }
}

/**
 * Reset the 'keys held' state.
 */
export function clearKeysHeld() {
    for (const direction of Object.keys(KEYS_HELD) as Direction[]) {
        KEYS_HELD[direction] = false;
        KEYS_PRESSED[direction] = false;
    }
}

/**
 * The direction keys to move with in this update: the ones being held, and the ones pressed since
 * the last update (so a quick tap, released before the next update, still moves the player).
 * Call it once per update.
 */
export function getKeysForUpdate(): DirectionKeys {
    const keys = { ...KEYS_HELD };

    for (const direction of Object.keys(KEYS_PRESSED) as Direction[]) {
        keys[direction] ||= KEYS_PRESSED[direction];
        KEYS_PRESSED[direction] = false;
    }

    return keys;
}

/**
 * Get the direction of a key (`null` if it isn't one of the movement keys).
 */
function codeToDirection(code: string): Direction | null {
    switch (code) {
        case "KeyA":
        case "ArrowLeft":
            return "left";

        case "KeyD":
        case "ArrowRight":
            return "right";

        case "KeyW":
        case "ArrowUp":
            return "up";

        case "KeyS":
        case "ArrowDown":
            return "down";
    }

    return null;
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

    const direction = codeToDirection(event.code);

    if (direction) {
        KEYS_HELD[direction] = true;
        KEYS_PRESSED[direction] = true;
    }
}

/**
 * `keyup` event listener.
 * Detect when a certain key stops being held.
 */
function handleKeyUp(event: KeyboardEvent) {
    const direction = codeToDirection(event.code);

    if (direction) {
        KEYS_HELD[direction] = false;
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
