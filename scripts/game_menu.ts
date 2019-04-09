import * as Options from "./options.js";
import * as Game from "./game.js";

var LIVES_ELEMENT: HTMLElement;
var LEVEL_ELEMENT: HTMLElement;
var HELP_SECTION: HTMLElement;
var TIMER: Utilities.Timer;

/**
 * Initialize the game menu elements. Called only once.
 */
export function init() {
    var container = document.getElementById("Menu")!;

    // play/stop the music
    var musicElement = document.getElementById("MusicState")!;
    var musicElementInfo = musicElement.querySelector("span")!;
    var isPlaying = Options.getMusicState();

    musicElementInfo.innerHTML = boolToString(isPlaying);
    musicElement.onclick = function() {
        isPlaying = !isPlaying;
        musicElementInfo.innerHTML = boolToString(isPlaying);

        Game.setMusicState(isPlaying);
    };

    // help section
    HELP_SECTION = document.getElementById("HelpSection")!;

    const openHelp = document.getElementById("Help")!;
    openHelp.onclick = toggleHelpListener;

    const closeHelp = document.getElementById("HelpClose")!;
    closeHelp.onclick = toggleHelpListener;

    // restart the game
    var restart = document.getElementById("Restart")!;
    restart.onclick = function() {
        Game.restart();
    };

    // lives count
    LIVES_ELEMENT = container.querySelector("#Lives span") as HTMLElement;

    // current level
    LEVEL_ELEMENT = container.querySelector("#Level span") as HTMLElement;

    // timer
    var timerElement = container.querySelector("#Timer span") as HTMLElement;

    TIMER = new Utilities.Timer(timerElement);
}

/**
 * Update the number of lives value in the UI.
 */
export function setLives(lives: number) {
    LIVES_ELEMENT.innerHTML = lives.toString();
}

/**
 * Update the current level in the game menu UI.
 */
export function setLevel(level: number) {
    LEVEL_ELEMENT.innerHTML = level.toString();
}

/**
 * The start of a new game, reset the state/values.
 */
export function startGame(level: number, lives: number) {
    TIMER.restart();
    setLevel(level);
    setLives(lives);
}

/**
 * Get the timer object.
 */
export function getTimer() {
    return TIMER;
}

/**
 * Show the game menu.
 */
export function show() {
    var menu = document.getElementById("Menu")!;
    menu.classList.remove("hidden");
}

/**
 * Hide the game menu.
 */
export function hide() {
    var menu = document.getElementById("Menu")!;
    menu.classList.add("hidden");
}

/**
 * Convert a boolean to the equivalent string.
 */
function boolToString(value: boolean) {
    if (value === true) {
        return "On";
    }

    return "Off";
}

/**
 * Toggle the help section on mouse click (on the menu help button).
 */
function toggleHelpListener(event: MouseEvent) {
    toggleHelpSection();
}

/**
 * Show/hide the help section on the center of the screen.
 * You can force a certain state (hidden, or shown) by passing an argument.
 */
export function toggleHelpSection(forceHidden?: boolean) {
    HELP_SECTION.classList.toggle("hidden", forceHidden);
}

/**
 * The first time the application is opened, we show the help section and wait for the close button to be pressed before starting the game.
 */
export async function openInitialHelpSection() {
    return new Promise((resolve) => {
        var closeHelp = document.getElementById("HelpClose")!;
        closeHelp.onclick = () => {
            toggleHelpSection();

            // set the default listener back
            closeHelp.onclick = toggleHelpListener;
            resolve();
        };

        toggleHelpSection();
    });
}
