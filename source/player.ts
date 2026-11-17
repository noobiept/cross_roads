import * as GameMenu from "./game_menu.js";
import * as Keyboard from "./keyboard.js";
import {
    getAsset,
    addToStage,
    getCanvasDimensions,
    removeFromStage,
    bringToTop,
} from "./main.js";
import { GameElement, CanvasPosition } from "./game.js";
import { getRandomInt } from "@drk4/utilities";
import * as Engine from "@drk4/game-engine";

export default class Player implements GameElement {
    private shape!: Engine.Bitmap;
    private width: number;
    private height: number;
    private movement_step: number;
    private movement_animation: number;
    private lives: number;

    constructor() {
        this.width = 15;
        this.height = 15;
        this.movement_step = 11;
        this.movement_animation = 0.09; // ease duration (in seconds)
        this.lives = 10;

        this.setupShape();
    }

    /**
     * Setup the shape (image) of the player.
     */
    setupShape() {
        const image = getAsset("player_1");
        const shape = new Engine.Bitmap({ image: image });

        this.shape = shape;
        this.getNewRandomShape();

        addToStage(shape);
    }

    /**
     * Get a random image for the player.
     */
    getNewRandomShape() {
        const position = getRandomInt(1, 8);
        this.shape.image = getAsset("player_" + position) as HTMLImageElement;
    }

    /**
     * Position immediately the player in the given position (top-left based).
     */
    positionIn(position: CanvasPosition) {
        Engine.Tween.removeTweens(this.shape);

        this.shape.x = position.x + this.width / 2;
        this.shape.y = position.y + this.height / 2;
    }

    /**
     * Move over time the player in the given direction by a certain amount (the movement step).
     */
    moveTo(xDirection: number, yDirection: number) {
        const canvas = getCanvasDimensions();
        const angle = Math.atan2(yDirection, xDirection);

        let nextX = this.getX() + Math.cos(angle) * this.movement_step;
        let nextY = this.getY() + Math.sin(angle) * this.movement_step;

        if (nextX < 0) {
            nextX = 0;
        } else if (nextX > canvas.width - this.width) {
            nextX = canvas.width - this.width;
        }

        if (nextY < 0) {
            nextY = 0;
        } else if (nextY > canvas.height - this.height) {
            nextY = canvas.height - this.height;
        }

        // the engine is center-origin, so convert the top-left target to a center
        new Engine.Tween(this.shape, { override: true })
            .to(
                {
                    x: nextX + this.width / 2,
                    y: nextY + this.height / 2,
                },
                this.movement_animation
            )
            .start();
    }

    /**
     * Remove the player's shape from the stage.
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
     * Get the current `width` value.
     */
    getWidth() {
        return this.width;
    }

    /**
     * Get the current `height` value.
     */
    getHeight() {
        return this.height;
    }

    /**
     * Get the number of lives the player has.
     */
    getCurrentLives() {
        return this.lives;
    }

    /**
     * Reduce the life of the player, and return whether there's still lives left or not.
     */
    oneLessLife() {
        this.lives--;

        GameMenu.setLives(this.lives);

        if (this.lives <= 0) {
            return false;
        }

        return true;
    }

    /**
     * Move the player in a direction based on which keys are being held.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tick(_deltaTime: number) {
        const keysHeld = Keyboard.KEYS_HELD;

        if (keysHeld.left && keysHeld.up) {
            this.moveTo(-1, -1);
        } else if (keysHeld.left && keysHeld.down) {
            this.moveTo(-1, 1);
        } else if (keysHeld.right && keysHeld.up) {
            this.moveTo(1, -1);
        } else if (keysHeld.right && keysHeld.down) {
            this.moveTo(1, 1);
        } else if (keysHeld.left) {
            this.moveTo(-1, 0);
        } else if (keysHeld.right) {
            this.moveTo(1, 0);
        } else if (keysHeld.up) {
            this.moveTo(0, -1);
        } else if (keysHeld.down) {
            this.moveTo(0, 1);
        }
    }

    /**
     * Bring the player's shape to the top of other elements (z-index).
     */
    bringToTop() {
        bringToTop(this.shape);
    }
}
