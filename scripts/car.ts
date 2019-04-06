import Level from "./level.js";
import {
    getCanvasDimensions,
    getAsset,
    addToStage,
    removeFromStage,
    getCarInfo,
} from "./main.js";
import { GameElement } from "./game.js";

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

        var _this = this;

        this.info = getCarInfo(args.type);
        this.width = this.info.width;
        this.height = this.info.height;

        this.shape = this.setupShape();

        this.shape.x = args.x;
        this.shape.y = args.y - this.height / 2;

        const canvas = getCanvasDimensions();
        var travelDuration = ((canvas.width - args.x) / this.info.speed) * 1000;

        createjs.Tween.get(this.shape)
            .to({ x: canvas.width }, travelDuration)
            .call(function() {
                args.level.removeCar(_this);
            });
    }

    setupShape() {
        var info = this.info;
        var shape = new createjs.Bitmap(getAsset(info.image));

        addToStage(shape);

        return shape;
    }

    clear() {
        removeFromStage(this.shape);
    }

    getX() {
        return this.shape.x;
    }

    getY() {
        return this.shape.y;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}
