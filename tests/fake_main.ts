/**
 * Replaces `source/main.ts` in the tests (with `vi.mock()`): the same functions, but the files come
 * from the `public` folder instead of being loaded by the page, and the images are blank.
 */
import * as Engine from "@drk4/game-engine";
import type * as Main from "../source/main.js";
import type { AllCarsInfo } from "../source/car.js";
import type { LevelInfo } from "../source/level.js";
import cars from "../public/data/cars.json";

const LEVELS = import.meta.glob<LevelInfo>("../public/data/levels/*.json", {
    eager: true,
    import: "default",
});

// the elements take their size from their image (only the player's is the real one)
export const PLAYER_SIZE = 15;
export const CAR_WIDTH = 40;
export const CAR_HEIGHT = 20;

function blankImage(width: number, height: number) {
    const image = new Image();

    image.width = width;
    image.height = height;

    return image;
}

export const getCanvasDimensions: typeof Main.getCanvasDimensions = () => ({
    width: 600,
    height: 600,
});

export const addToStage: typeof Main.addToStage = (element) => {
    Engine.addElement(element);
};

export const removeFromStage: typeof Main.removeFromStage = (element) => {
    element.destroy();
};

export const bringToTop: typeof Main.bringToTop = (element) => {
    Engine.getCanvas().bringToFront(element);
};

export const getImage: typeof Main.getImage = (id) => {
    if (id.startsWith("player_")) {
        return blankImage(PLAYER_SIZE, PLAYER_SIZE);
    }

    // 6 frames of 32x32 pixels
    if (id === "explosion") {
        return blankImage(6 * 32, 32);
    }

    return blankImage(CAR_WIDTH, CAR_HEIGHT);
};

// the game runs without the music
export const getAudio: typeof Main.getAudio = () => undefined;

export const getLevelInfo: typeof Main.getLevelInfo = (level) =>
    LEVELS[`../public/data/levels/level${level}.json`];

export const getCarInfo: typeof Main.getCarInfo = (type) =>
    (cars as AllCarsInfo)[type];
