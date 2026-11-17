import * as Options from "./options.js";
import * as Engine from "@drk4/game-engine";
import { getAudio } from "./main.js";

let MUSIC: Engine.Sound.SoundInstance | null = null;

/**
 * Set up the music (it starts paused).
 * The game can run without it, so nothing happens when its file wasn't loaded (it failed to load,
 * or it's still loading).
 */
function setup() {
    const buffer = getAudio("happy_tune");

    if (!buffer) {
        return;
    }

    MUSIC = Engine.Sound.play(buffer, { loop: true });
    MUSIC?.pause();
}

/**
 * Play the background music (if the option is set).
 * The engine pauses it while the page is hidden.
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
    MUSIC?.pause();
}
