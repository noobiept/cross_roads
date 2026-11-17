import Level from "./level.js";
import {
    getCanvasDimensions,
    getImage,
    addToStage,
    removeFromStage,
    getCarInfo,
} from "./main.js";
import * as Engine from "@drk4/game-engine";

export type CarType = "one" | "two" | "three" | "four" | "five" | "six";

export type AllCarsInfo = { [key in CarType]: CarInfo };

export interface CarInfo {
    image: string;
    speed: number; // in pixels per second
}

export interface CarArgs {
    x?: number; // the left edge (default `0`)
    y: number; // the center of its lane
    type: CarType;
    level: Level;
}

export default class Car {
    private shape: Engine.Bitmap;

    constructor(args: CarArgs) {
        const info = getCarInfo(args.type);
        const canvas = getCanvasDimensions();

        this.shape = new Engine.Bitmap({ image: getImage(info.image) });
        this.shape.left = args.x ?? 0;
        this.shape.y = args.y;

        addToStage(this.shape);

        const travelDuration = (canvas.width - this.shape.left) / info.speed; // in seconds

        // until the car is fully off the right edge
        new Engine.Tween(this.shape)
            .to({ left: canvas.width }, travelDuration)
            .call(() => {
                args.level.removeCar(this);
            })
            .start();
    }

    /**
     * Remove the car from the stage (so it isn't displayed anymore).
     */
    clear() {
        removeFromStage(this.shape);
    }

    /**
     * Get the element shown in the canvas (to check if it hits the player, for example).
     */
    getShape() {
        return this.shape;
    }
}
