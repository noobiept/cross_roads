import * as Options from "./options.js";
import * as Engine from "@drk4/game-engine";
import { getAsset } from "./main.js";

let MUSIC: Engine.Sound.SoundInstance | null = null;

/**
 * Initialize the music.
 */
export function init() {
    MUSIC = Engine.Sound.play(getAsset("happy_tune"), { loop: true });
    MUSIC?.pause();
}

/**
 * Play the background music (if the option is set).
 */
export function play() {
    if (Options.getMusicState() === true) {
        if (!MUSIC) {
            init();
        }

        MUSIC?.resume();
    }
}

/**
 * Stop playing the background music.
 */
export function stop() {
    if (MUSIC) {
        MUSIC.pause();
    }
}
