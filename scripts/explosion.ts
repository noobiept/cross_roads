import { getAsset, addToStage, removeFromStage } from "./main.js";
import { GameElement } from "./game.js";

export interface ExplosionArgs {
    x: number;
    y: number;
}

export default class Explosion implements GameElement {
    private sprite: createjs.Sprite;
    private width: number;
    private height: number;

    constructor(args?: ExplosionArgs) {
        if (!args) {
            args = {
                x: 0,
                y: 0,
            };
        }

        const width = 32;
        const height = 32;
        const data = {
            images: [getAsset("explosion")],
            frames: {
                width: width,
                height: height,
                count: 6,
                regX: 0,
                regY: 0,
            },
            animations: {
                explode: {
                    frames: [0, 1, 2, 3, 4, 5],
                    speed: 0.2,
                },
            },
        };
        const spriteSheet = new createjs.SpriteSheet(data);
        const sprite = new createjs.Sprite(spriteSheet, "explode");

        sprite.x = args.x;
        sprite.y = args.y;
        sprite.addEventListener("animationend", () => {
            this.clear();
        });

        addToStage(sprite);

        this.sprite = sprite;
        this.width = width;
        this.height = height;
    }

    /**
     * Position the element in the given position.
     */
    setPosition(position: { x: number; y: number }) {
        this.sprite.x = position.x;
        this.sprite.y = position.y;
    }

    /**
     * Remove the element from the stage.
     */
    clear() {
        removeFromStage(this.sprite);
    }

    /**
     * Get the current `x` position.
     */
    getX() {
        return this.sprite.x;
    }

    /**
     * Get the current `y` position.
     */
    getY() {
        return this.sprite.y;
    }

    /**
     * Get the element's `width` value.
     */
    getWidth() {
        return this.width;
    }

    /**
     * Get the element's `height` value.
     */
    getHeight() {
        return this.height;
    }
}
