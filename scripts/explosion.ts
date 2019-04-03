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

    setPosition(position: { x: number; y: number }) {
        this.sprite.x = position.x;
        this.sprite.y = position.y;
    }

    clear() {
        removeFromStage(this.sprite);
    }

    getX() {
        return this.sprite.x;
    }

    getY() {
        return this.sprite.y;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}
