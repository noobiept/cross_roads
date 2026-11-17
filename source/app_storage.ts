import { getObject, saveObject } from "@drk4/utilities";
import { HighScoreData } from "./high_score.js";
import { OptionsData } from "./options.js";

export interface StorageData {
    cross_roads_high_score?: HighScoreData;
    cross_roads_options?: OptionsData;
    cross_roads_has_run_before?: boolean;
}

export type StorageKey = keyof StorageData;

/**
 * What was saved for each key (`null` when nothing was saved, or it isn't valid json).
 * It can be anything (saved by an older version of the game, or changed by hand), so check it before using it.
 */
export type SavedData = Partial<Record<StorageKey, unknown>>;

/**
 * Calls the `callback` with a dictionary that has all the requested keys/values from `localStorage`.
 */
export function getData(
    keys: StorageKey[],
    callback: (data: SavedData) => void
) {
    const objects: SavedData = {};

    for (let a = 0; a < keys.length; a++) {
        const key = keys[a];

        objects[key] = getObject(key);
    }

    callback(objects);
}

/**
 * Sets the given key/value into `localStorage`. Calls the `callback` when its done.
 * Converts the value to string (with json).
 */
export function setData(items: StorageData, callback?: () => void) {
    for (const key in items) {
        if (Object.prototype.hasOwnProperty.call(items, key)) {
            const dataKey = key as StorageKey;
            saveObject(key, items[dataKey]);
        }
    }

    if (callback) {
        callback();
    }
}
