import * as GameMenu from "./game_menu.js";
import * as Keyboard from "./keyboard.js";
import {
    getImage,
    addToStage,
    getCanvasDimensions,
    removeFromStage,
    bringToTop,
} from "./main.js";
import { CanvasPosition } from "./game.js";
import { getRandomInt } from "@drk4/utilities";
import * as Engine from "@drk4/game-engine";

export default class Player {
    private shape!: Engine.Bitmap;
    private movement_speed: number;
    private movement_glide: number;
    private lives: number;

    constructor() {
        this.movement_speed = 122; // while a key is held (pixels per second)
        this.movement_glide = 7; // how far it keeps moving after the key is released (in pixels)
        this.lives = 10;

        this.setupShape();
    }

    /**
     * Setup the shape (image) of the player.
     */
    setupShape() {
        const shape = new Engine.Bitmap({ image: getImage("player_1") });

        this.shape = shape;
        this.getNewRandomShape();

        addToStage(shape);
    }

    /**
     * Get a random image for the player.
     */
    getNewRandomShape() {
        const position = getRandomInt(1, 8);
        this.shape.image = getImage("player_" + position);
    }

    /**
     * Position immediately the player in the given position (top-left based).
     */
    positionIn(position: CanvasPosition) {
        Engine.Tween.removeTweens(this.shape);

        this.shape.left = position.x;
        this.shape.top = position.y;
    }

    /**
     * Move the player in the given direction, in an update where the key is held.
     *
     * It moves this update's distance plus the glide: when the key is still held in the next update,
     * it starts again from where it is, and once the key is released, it only moves the glide. So it
     * moves the same way whatever the frame rate is (with a fixed distance ahead, the glide was what
     * was left of it after the update's movement).
     */
    moveTo(xDirection: number, yDirection: number, deltaTime: number) {
        const canvas = getCanvasDimensions();
        const angle = Math.atan2(yDirection, xDirection);
        const distance = this.movement_speed * deltaTime + this.movement_glide;

        const shape = this.shape;

        let nextX = shape.left + Math.cos(angle) * distance;
        let nextY = shape.top + Math.sin(angle) * distance;

        if (nextX < 0) {
            nextX = 0;
        } else if (nextX > canvas.width - shape.width) {
            nextX = canvas.width - shape.width;
        }

        if (nextY < 0) {
            nextY = 0;
        } else if (nextY > canvas.height - shape.height) {
            nextY = canvas.height - shape.height;
        }

        // at the same speed when it's stopped by the canvas edges
        const duration =
            Math.hypot(nextX - shape.left, nextY - shape.top) /
            this.movement_speed;

        // the tweens are updated after the game loop callbacks, so it already moves in this update
        new Engine.Tween(shape, { override: true })
            .to({ left: nextX, top: nextY }, duration)
            .start();
    }

    /**
     * Remove the player's shape from the stage.
     */
    clear() {
        removeFromStage(this.shape);
    }

    /**
     * Get the current `y` position value (top-left).
     */
    getY() {
        return this.shape.top;
    }

    /**
     * Get the current `width` value.
     */
    getWidth() {
        return this.shape.width;
    }

    /**
     * Get the current `height` value.
     */
    getHeight() {
        return this.shape.height;
    }

    /**
     * Get the element shown in the canvas (to check if a car hits it, for example).
     */
    getShape() {
        return this.shape;
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
    tick(deltaTime: number) {
        const keys = Keyboard.getDirections();

        if (keys.left && keys.up) {
            this.moveTo(-1, -1, deltaTime);
        } else if (keys.left && keys.down) {
            this.moveTo(-1, 1, deltaTime);
        } else if (keys.right && keys.up) {
            this.moveTo(1, -1, deltaTime);
        } else if (keys.right && keys.down) {
            this.moveTo(1, 1, deltaTime);
        } else if (keys.left) {
            this.moveTo(-1, 0, deltaTime);
        } else if (keys.right) {
            this.moveTo(1, 0, deltaTime);
        } else if (keys.up) {
            this.moveTo(0, -1, deltaTime);
        } else if (keys.down) {
            this.moveTo(0, 1, deltaTime);
        }
    }

    /**
     * Bring the player's shape to the top of other elements (z-index).
     */
    bringToTop() {
        bringToTop(this.shape);
    }
}
