import { getAsset, addToStage, removeFromStage } from "./main.js";

export interface ExplosionArgs {
    x: number;
    y: number;
}

export default class Explosion {
    sprite: createjs.Sprite;

    constructor(args: ExplosionArgs) {
        const data = {
            images: [getAsset("explosion")],
            frames: {
                width: 32,
                height: 32,
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
    }

    clear() {
        removeFromStage(this.sprite);
    }
}
