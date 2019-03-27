import * as AppStorage from "./app_storage.js";

export interface OptionsData {
    music_state: boolean;
}

var OPTIONS: OptionsData = {
    music_state: true,
};

export function load(optionsData?: OptionsData) {
    if (optionsData) {
        if (Utilities.isBoolean(optionsData.music_state)) {
            OPTIONS.music_state = optionsData.music_state;
        }
    }
}

function save() {
    AppStorage.setData({ cross_roads_options: OPTIONS });
}

export function setMusicState(state: boolean) {
    OPTIONS.music_state = state;
    save();
}

export function getMusicState() {
    return OPTIONS.music_state;
}
