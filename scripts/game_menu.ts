/// <reference path="../libraries/utilities/utilities.1.8.0.d.ts" />
import * as Options from "./options.js";
import * as Game from "./game.js";

var LIVES_ELEMENT: HTMLElement;
var LEVEL_ELEMENT: HTMLElement;
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

export function startGame() {
    TIMER.restart();
    setLevel(Game.getCurrentLevel());
    setLives(Game.getPlayer()!.lives);
}

export function getTimer() {
    return TIMER;
}

export function show() {
    var menu = document.getElementById("Menu")!;
    menu.style.display = "block";
}

export function hide() {
    var menu = document.getElementById("Menu")!;
    menu.style.display = "none";
}

function boolToString(value: boolean) {
    if (value === true) {
        return "On";
    }

    return "Off";
}
