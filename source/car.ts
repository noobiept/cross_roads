import Level from "./level.js";
import {
    getCanvasDimensions,
    getAsset,
    addToStage,
    removeFromStage,
    getCarInfo,
} from "./main.js";
import { GameElement, CanvasPosition } from "./game.js";

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
    private shape: createjs.Bitmap;
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
        const travelDuration =
            ((canvas.width - args.x) / this.info.speed) * 1000;

        createjs.Tween.get(this.shape)
            .to({ x: canvas.width }, travelDuration)
            .call(() => {
                args.level.removeCar(this);
            });
    }

    /**
     * Setup the display object of the car (an image).
     */
    setupShape() {
        const info = this.info;
        const shape = new createjs.Bitmap(getAsset(info.image));

        addToStage(shape);

        return shape;
    }

    /**
     * Position the car in the given x/y position.
     */
    positionIn(position: CanvasPosition) {
        this.shape.x = position.x;
        this.shape.y = position.y;
    }

    /**
     * Remove the car from the stage (so it isn't displayed anymore).
     */
    clear() {
        removeFromStage(this.shape);
    }

    /**
     * Get the current `x` position value.
     */
    getX() {
        return this.shape.x;
    }

    /**
     * Get the current `y` position value.
     */
    getY() {
        return this.shape.y;
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
