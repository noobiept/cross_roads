import * as Options from "./options.js";

let MUSIC: createjs.AbstractSoundInstance;

/**
 * Initialize the music.
 */
export function init() {
    MUSIC = createjs.Sound.play("happy_tune", { loop: -1 });
    MUSIC.paused = true;
}

/**
 * Play the background music (if the option is set).
 */
export function play() {
    if (Options.getMusicState() === true) {
        if (!MUSIC) {
            init();
        }

        MUSIC.paused = false;
    }
}

/**
 * Stop playing the background music.
 */
export function stop() {
    if (MUSIC) {
        MUSIC.paused = true;
    }
}
