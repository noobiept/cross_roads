import * as Options from "./options.js";

let MUSIC: createjs.AbstractSoundInstance;

export function init() {
    MUSIC = createjs.Sound.play("happy_tune", { loop: -1 });
    MUSIC.paused = true;
}

export function play() {
    if (Options.getMusicState() === true) {
        if (!MUSIC) {
            init();
        }

        MUSIC.paused = false;
    }
}

export function stop() {
    MUSIC.paused = true;
}
