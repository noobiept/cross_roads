import * as Options from "./options.js";
import * as Game from "./game.js";

let LIVES_ELEMENT: HTMLElement;
let LEVEL_ELEMENT: HTMLElement;
let HELP_SECTION: HTMLElement;

/**
 * Initialize the game menu elements. Called only once.
 */
export function init() {
    const container = document.getElementById("Menu")!;

    // play/stop the music
    const musicElement = document.getElementById("MusicState")!;
    const musicElementInfo = musicElement.querySelector("span")!;
    let isPlaying = Options.getMusicState();

    musicElementInfo.innerHTML = boolToString(isPlaying);
    musicElement.onclick = function () {
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
    const restart = document.getElementById("Restart")!;
    restart.onclick = function () {
        Game.restart();
    };

    // lives count
    LIVES_ELEMENT = container.querySelector("#Lives span") as HTMLElement;

    // current level
    LEVEL_ELEMENT = container.querySelector("#Level span") as HTMLElement;
}

/**
 * Get the timer element where you can update the timer value.
 */
export function getTimerElement() {
    const timer = document.getElementById("Timer")!;
    const value = timer.querySelector("span")!;

    return value;
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
    setLevel(level);
    setLives(lives);
}

/**
 * Show the game menu.
 */
export function show() {
    const menu = document.getElementById("Menu")!;
    menu.classList.remove("hidden");
}

/**
 * Hide the game menu.
 */
export function hide() {
    const menu = document.getElementById("Menu")!;
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
function toggleHelpListener() {
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
    return new Promise<void>((resolve) => {
        const closeHelp = document.getElementById("HelpClose")!;
        closeHelp.onclick = () => {
            toggleHelpSection();

            // set the default listener back
            closeHelp.onclick = toggleHelpListener;
            resolve();
        };

        toggleHelpSection();
    });
}
