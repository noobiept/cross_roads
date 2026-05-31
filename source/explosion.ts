import { getAsset, addToStage, removeFromStage } from "./main.js";
import { GameElement, CanvasPosition } from "./game.js";
import * as Engine from "@drk4/game-engine";

export interface ExplosionArgs {
    x: number;
    y: number;
}

export default class Explosion implements GameElement {
    private sprite: Engine.Sprite;
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
        const sprite = new Engine.Sprite({
            image: getAsset("explosion"),
            frameWidth: width,
            frameHeight: height,
            interval: 0.08, // seconds per frame
            animations: {
                explode: [0, 1, 2, 3, 4, 5],
            },
        });

        this.sprite = sprite;
        this.width = width;
        this.height = height;

        this.positionIn({ x: args.x, y: args.y });
        sprite.addEventListener("animationend", () => {
            this.clear();
        });
        sprite.play("explode", { loop: false });

        addToStage(sprite);
    }

    /**
     * Position the element in the given position (top-left based).
     */
    positionIn(position: CanvasPosition) {
        this.sprite.x = position.x + this.width / 2;
        this.sprite.y = position.y + this.height / 2;
    }

    /**
     * Remove the element from the stage.
     */
    clear() {
        removeFromStage(this.sprite);
    }

    /**
     * Get the current `x` position (top-left).
     */
    getX() {
        return this.sprite.x - this.width / 2;
    }

    /**
     * Get the current `y` position (top-left).
     */
    getY() {
        return this.sprite.y - this.height / 2;
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
