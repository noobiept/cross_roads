import * as GameMenu from "./game_menu.js";
import * as Keyboard from "./keyboard.js";
import {
    getAsset,
    addToStage,
    getCanvasDimensions,
    removeFromStage,
} from "./main.js";
import { GameElement, CanvasPosition } from "./game.js";
import { getRandomInt } from "@drk4/utilities";

export default class Player implements GameElement {
    private shape!: createjs.Bitmap;
    private width: number;
    private height: number;
    private movement_step: number;
    private movement_animation: number;
    private lives: number;

    constructor() {
        this.width = 15;
        this.height = 15;
        this.movement_step = 11;
        this.movement_animation = 90; // ease duration
        this.lives = 10;

        this.setupShape();
    }

    /**
     * Setup the shape (image) of the player.
     */
    setupShape() {
        const image = getAsset("player_1");
        const shape = new createjs.Bitmap(image);

        this.shape = shape;
        this.getNewRandomShape();

        addToStage(shape);
    }

    /**
     * Get a random image for the player.
     */
    getNewRandomShape() {
        var position = getRandomInt(1, 8);
        this.shape.image = getAsset("player_" + position) as HTMLImageElement;
    }

    /**
     * Position immediately the player in the given position.
     */
    positionIn(position: CanvasPosition) {
        createjs.Tween.removeTweens(this.shape);

        this.shape.x = position.x;
        this.shape.y = position.y;
    }

    /**
     * Move over time the player in the given direction by a certain amount (the movement step).
     */
    moveTo(xDirection: number, yDirection: number) {
        const canvas = getCanvasDimensions();
        var angle = Math.atan2(yDirection, xDirection);

        var nextX = this.shape.x + Math.cos(angle) * this.movement_step;
        var nextY = this.shape.y + Math.sin(angle) * this.movement_step;

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

        createjs.Tween.get(this.shape, { override: true }).to(
            {
                x: nextX,
                y: nextY,
            },
            this.movement_animation
        );
    }

    /**
     * Remove the player's shape from the stage.
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
    tick(_event: createjs.TickerEvent) {
        var keysHeld = Keyboard.KEYS_HELD;

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
        addToStage(this.shape);
    }
}
