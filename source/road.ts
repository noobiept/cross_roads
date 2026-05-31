import { getCanvasDimensions, addToStage, removeFromStage } from "./main.js";
import { GameElement, CanvasPosition } from "./game.js";
import * as Engine from "@drk4/game-engine";

export interface RoadInfo {
    lanes: number;
    side_walks: number[];
}

export default class Road implements GameElement {
    static readonly LANE_HEIGHT = 30; // height of each lane, as well of the side walks

    private lines: Engine.Rectangle[];
    private container: Engine.Container;
    private lanes: number;
    private side_walks: number[];
    private width: number;
    private height: number;

    constructor(info: RoadInfo) {
        const canvas = getCanvasDimensions();

        this.lines = [];
        this.lanes = info.lanes;
        this.side_walks = info.side_walks;
        this.width = canvas.width;
        this.height = this.lanes * Road.LANE_HEIGHT;
        this.container = this.setupShape();

        this.positionIn({ x: 0, y: canvas.height / 2 - this.height / 2 });
    }

    /**
     * Setup the all the road elements (side walks, and lane separators), and add that to the stage.
     *
     * The children are positioned in a top-left local space (origin at the road's top-left
     * corner). The engine is center-origin, so each rectangle's center is its
     * `top-left + size / 2`, and the container's position (set in `positionIn`) places that
     * local origin on the canvas.
     */
    setupShape() {
        const canvas = getCanvasDimensions();
        const container = new Engine.Container();

        const linesColor = "black";
        const sideWalkColor = "gray";
        const lineHeight = 1;
        const width = canvas.width;

        const addRect = (
            left: number,
            top: number,
            rectWidth: number,
            rectHeight: number,
            color: string
        ) => {
            const rect = new Engine.Rectangle({
                x: left + rectWidth / 2,
                y: top + rectHeight / 2,
                width: rectWidth,
                height: rectHeight,
                color: color,
            });

            container.addChild(rect);
            this.lines.push(rect);
        };

        // :: Side walks :: //

        for (let a = 0; a < this.side_walks.length; a++) {
            addRect(
                0,
                this.side_walks[a] * Road.LANE_HEIGHT,
                width,
                Road.LANE_HEIGHT,
                sideWalkColor
            );
        }

        // :: Lane separators :: //

        // a lane is where the car will move
        // between each lane, there is a middle line separating the lanes
        const middleLineLength = 20;
        const lengthBetweenLines = middleLineLength / 2;

        for (let a = 0; a < this.lanes; a++) {
            // see if the next lane is not a sidewalk
            // that means we need to add a middle line
            if (
                this.side_walks.indexOf(a) < 0 &&
                this.side_walks.indexOf(a + 1) < 0
            ) {
                let midLength = 0;
                let length;

                while (midLength < width) {
                    if (midLength + middleLineLength < width) {
                        length = middleLineLength;
                    } else {
                        length = width - midLength;
                    }

                    addRect(
                        midLength,
                        Road.LANE_HEIGHT + a * Road.LANE_HEIGHT,
                        length,
                        lineHeight,
                        linesColor
                    );

                    midLength += length + lengthBetweenLines;
                }
            }
        }

        // :: Container :: //
        addToStage(container);

        return container;
    }

    /**
     * Position the road in the given position (top-left of the road area).
     */
    positionIn(position: CanvasPosition) {
        this.container.x = position.x;
        this.container.y = position.y;
    }

    /**
     * Remove all the road elements from the stage.
     */
    clear() {
        removeFromStage(this.container);
        this.lines.length = 0;
    }

    /**
     * Return the `y` position of the given lane (so you know where to add the cars).
     */
    laneToY(lane: number) {
        return this.getY() + lane * Road.LANE_HEIGHT + Road.LANE_HEIGHT / 2;
    }

    /**
     * Get the `x` position of the road.
     */
    getX() {
        return this.container.x;
    }

    /**
     * Get the `y` position of the road.
     */
    getY() {
        return this.container.y;
    }

    /**
     * Get the road's `width`.
     */
    getWidth() {
        return this.width;
    }

    /**
     * Get the road's `height`.
     */
    getHeight() {
        return this.height;
    }
}
