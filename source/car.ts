import Level from "./level.js";
import {
    getCanvasDimensions,
    getAsset,
    addToStage,
    removeFromStage,
    getCarInfo,
} from "./main.js";
import { GameElement, CanvasPosition } from "./game.js";
import * as Engine from "@drk4/game-engine";

export type CarType = "one" | "two" | "three" | "four" | "five" | "six";

export type AllCarsInfo = { [key in CarType]: CarInfo };

export interface CarInfo {
    image: string;
    speed: number;
    width: number;
    height: number;
}

export interface CarArgs {
    x?: number;
    y: number;
    type: CarType;
    level: Level;
}

export default class Car implements GameElement {
    private shape: Engine.Bitmap;
    private info: CarInfo;
    private width: number;
    private height: number;

    constructor(args: CarArgs) {
        if (typeof args.x === "undefined") {
            args.x = 0;
        }

        this.info = getCarInfo(args.type);
        this.width = this.info.width;
        this.height = this.info.height;

        this.shape = this.setupShape();

        this.positionIn({
            x: args.x,
            y: args.y - this.height / 2,
        });

        const canvas = getCanvasDimensions();
        const travelDuration = (canvas.width - args.x) / this.info.speed; // in seconds

        // tween the (center) `x` until the car is fully off the right edge
        new Engine.Tween(this.shape)
            .to({ x: canvas.width + this.width / 2 }, travelDuration)
            .call(() => {
                args.level.removeCar(this);
            })
            .start();
    }

    /**
     * Setup the display object of the car (an image).
     */
    setupShape() {
        const info = this.info;
        const shape = new Engine.Bitmap({ image: getAsset(info.image) });

        addToStage(shape);

        return shape;
    }

    /**
     * Position the car in the given x/y position (top-left based).
     */
    positionIn(position: CanvasPosition) {
        this.shape.x = position.x + this.width / 2;
        this.shape.y = position.y + this.height / 2;
    }

    /**
     * Remove the car from the stage (so it isn't displayed anymore).
     */
    clear() {
        removeFromStage(this.shape);
    }

    /**
     * Get the current `x` position value (top-left).
     */
    getX() {
        return this.shape.x - this.width / 2;
    }

    /**
     * Get the current `y` position value (top-left).
     */
    getY() {
        return this.shape.y - this.height / 2;
    }

    /**
     * Get the car's `width` value.
     */
    getWidth() {
        return this.width;
    }

    /**
     * Get the car's `height` value.
     */
    getHeight() {
        return this.height;
    }
}
