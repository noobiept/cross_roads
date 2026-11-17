import { getImage, addToStage } from "./main.js";
import { CanvasPosition } from "./game.js";
import * as Engine from "@drk4/game-engine";

/**
 * Show an explosion animation (it's taken out of the stage once it ends).
 *
 * @param center Where its center is.
 */
export default function explode(center: CanvasPosition) {
    const sprite = new Engine.Sprite({
        image: getImage("explosion"),
        frameWidth: 32,
        frameHeight: 32,
        interval: 0.08, // seconds per frame
        animations: {
            explode: [0, 1, 2, 3, 4, 5],
        },
    });

    sprite.x = center.x;
    sprite.y = center.y;
    sprite.play("explode", { loop: false, destroyOnEnd: true });

    addToStage(sprite);
}
