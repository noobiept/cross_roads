import { isBoolean } from "@drk4/utilities";
import * as AppStorage from "./app_storage.js";

export interface OptionsData {
    music_state: boolean;
}

const OPTIONS: OptionsData = {
    music_state: true,
};

/**
 * Load the options given.
 */
export function load(optionsData?: OptionsData) {
    if (optionsData) {
        if (isBoolean(optionsData.music_state)) {
            OPTIONS.music_state = optionsData.music_state;
        }
    }
}

/**
 * Save the current options to the local storage.
 */
function save() {
    AppStorage.setData({ cross_roads_options: OPTIONS });
}

/**
 * Change the music option.
 */
export function setMusicState(state: boolean) {
    OPTIONS.music_state = state;
    save();
}

/**
 * Get the current value of the music option.
 */
export function getMusicState() {
    return OPTIONS.music_state;
}
