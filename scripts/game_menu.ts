/// <reference path="../libraries/utilities/utilities.1.8.0.d.ts" />
import * as Options from "./options.js";
import * as Game from "./game.js";

var LIVES_ELEMENT: HTMLElement;
var LEVEL_ELEMENT: HTMLElement;
var HELP_SECTION: HTMLElement;
var TIMER: Utilities.Timer;

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

export function setLives(lives: number) {
    LIVES_ELEMENT.innerHTML = lives.toString();
}

export function setLevel(level: number) {
    LEVEL_ELEMENT.innerHTML = level.toString();
}

export function startGame(level: number, lives: number) {
    TIMER.restart();
    setLevel(level);
    setLives(lives);
}

export function getTimer() {
    return TIMER;
}

export function show() {
    var menu = document.getElementById("Menu")!;
    menu.classList.remove("hidden");
}

export function hide() {
    var menu = document.getElementById("Menu")!;
    menu.classList.add("hidden");
}

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
