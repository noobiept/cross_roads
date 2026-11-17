import { isBoolean } from "@drk4/utilities";
import * as AppStorage from "./app_storage.js";

export interface OptionsData {
    music_state: boolean;
}

const OPTIONS: OptionsData = {
    music_state: true,
};

/**
 * Load the saved options (it can be anything, only the values of the right type are used).
 */
export function load(optionsData: unknown) {
    if (typeof optionsData === "object" && optionsData !== null) {
        const options = optionsData as Partial<
            Record<keyof OptionsData, unknown>
        >;

        if (isBoolean(options.music_state)) {
            OPTIONS.music_state = options.music_state;
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
