import { isArray, isNumber, timeToString } from "@drk4/utilities";
import * as AppStorage from "./app_storage.js";

export type HighScoreData = number[];

let HIGH_SCORE: HighScoreData = [];
const SAVE_LIMIT = 5; // the total scores we keep track of
const LIST_ITEMS: HTMLElement[] = [];

/**
 * Initialize the module with the saved scores (it can be anything, only the valid times are used).
 */
export function init(scoreData: unknown) {
    const ul = document.getElementById("HighScore")!;

    // add the list items that will have the high scores
    for (let a = 0; a < SAVE_LIMIT; a++) {
        const li = document.createElement("li");

        li.className = "value";
        ul.appendChild(li);

        LIST_ITEMS.push(li);
    }

    if (isArray(scoreData)) {
        HIGH_SCORE = scoreData
            .filter((value): value is number => isNumber(value) && value >= 0)
            .sort((a, b) => a - b)
            .slice(0, SAVE_LIMIT);
    }

    updateHtmlElement();
}

/**
 * Add a new high-score.
 */
export function add(value: number) {
    // don't add repeated values
    if (HIGH_SCORE.indexOf(value) >= 0) {
        return;
    }

    HIGH_SCORE.push(value);

    // the lower the value (which represents the time it took to finish the game) the better
    HIGH_SCORE.sort(function (a, b) {
        return a - b;
    });

    // if we have more elements than the limit, remove the worse (higher) value
    if (HIGH_SCORE.length > SAVE_LIMIT) {
        HIGH_SCORE.pop();
    }

    save();
    updateHtmlElement();
}

/**
 * Update the html element, with the current high-scores.
 */
function updateHtmlElement() {
    for (let a = 0; a < SAVE_LIMIT; a++) {
        const value = HIGH_SCORE[a];
        const li = LIST_ITEMS[a];

        if (typeof value === "undefined") {
            li.innerHTML = "-";
        } else {
            li.innerHTML = timeToString({
                time: value * 1000,
            });
        }
    }
}

/**
 * Save the current high-scores to the local storage.
 */
function save() {
    AppStorage.setData({ cross_roads_high_score: HIGH_SCORE });
}

/**
 * Remove all the high-scores from the game and from the local storage.
 */
export function clear() {
    HIGH_SCORE.length = 0;
    save();
}
