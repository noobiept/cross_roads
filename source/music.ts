import * as Options from "./options.js";
import * as Engine from "@drk4/game-engine";
import { getAsset } from "./main.js";

let MUSIC: Engine.Sound.SoundInstance | null = null;
let PAUSED_WITH_GAME = false; // it was playing when the game loop paused (so it's resumed with it)

/**
 * Initialize the module.
 * The engine pauses the game loop while the page is hidden, but not the sounds, so pause the music
 * along with the game.
 */
export function init() {
    Engine.addEventListener("pause", function () {
        if (MUSIC?.playing) {
            MUSIC.pause();
            PAUSED_WITH_GAME = true;
        }
    });
    Engine.addEventListener("resume", function () {
        if (PAUSED_WITH_GAME) {
            PAUSED_WITH_GAME = false;
            MUSIC?.resume();
        }
    });
}

/**
 * Set up the music (it starts paused).
 * The game can run without it, so nothing happens when its file wasn't loaded (it failed to load,
 * or it's still loading).
 */
function setup() {
    const buffer = getAsset("happy_tune") as AudioBuffer | undefined;

    if (!buffer) {
        return;
    }

    MUSIC = Engine.Sound.play(buffer, { loop: true });
    MUSIC?.pause();
}

/**
 * Play the background music (if the option is set).
 */
export function play() {
    if (Options.getMusicState() === true) {
        if (!MUSIC) {
            setup();
        }

        MUSIC?.resume();
    }
}

/**
 * Stop playing the background music.
 */
export function stop() {
    PAUSED_WITH_GAME = false;
    MUSIC?.pause();
}
