import * as AppStorage from "./app_storage.js";

export type HighScoreData = number[];

var HIGH_SCORE: HighScoreData = [];
var SAVE_LIMIT = 5; // the total scores we keep track of
var LIST_ITEMS: HTMLElement[] = [];

/**
 * Initialize the module with some optional previous scores.
 */
export function init(scoreData?: HighScoreData) {
    var ul = document.getElementById("HighScore")!;

    // add the list items that will have the high scores
    for (var a = 0; a < SAVE_LIMIT; a++) {
        var li = document.createElement("li");

        li.className = "value";
        ul.appendChild(li);

        LIST_ITEMS.push(li);
    }

    if (scoreData) {
        HIGH_SCORE = scoreData;
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
    HIGH_SCORE.sort(function(a, b) {
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
    for (var a = 0; a < SAVE_LIMIT; a++) {
        var value = HIGH_SCORE[a];
        var li = LIST_ITEMS[a];

        if (typeof value === "undefined") {
            li.innerHTML = "-";
        } else {
            li.innerHTML = Utilities.timeToString(value * 1000);
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
