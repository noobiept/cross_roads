import { getCanvasDimensions, addToStage, removeFromStage } from "./main.js";
import { GameElement, CanvasPosition } from "./game.js";

export interface RoadInfo {
    lanes: number;
    side_walks: number[];
}

export default class Road implements GameElement {
    static readonly LANE_HEIGHT = 30; // height of each lane, as well of the side walks

    private lines: createjs.Shape[];
    private container: createjs.Container;
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
     */
    setupShape() {
        const canvas = getCanvasDimensions();
        const container = new createjs.Container();

        const linesColor = "black";
        const sideWalkColor = "gray";
        const lineHeight = 1;
        const width = canvas.width;

        // :: Side walks :: //

        for (let a = 0; a < this.side_walks.length; a++) {
            const sideWalk = new createjs.Shape();

            const g = sideWalk.graphics;

            g.beginFill(sideWalkColor);
            g.drawRect(
                0,
                this.side_walks[a] * Road.LANE_HEIGHT,
                width,
                Road.LANE_HEIGHT
            );
            g.endFill();

            container.addChild(sideWalk);
            this.lines.push(sideWalk);
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

                    const shape = new createjs.Shape();
                    const g = shape.graphics;

                    g.beginFill(linesColor);
                    g.drawRect(
                        midLength,
                        Road.LANE_HEIGHT + a * Road.LANE_HEIGHT,
                        length,
                        lineHeight
                    );
                    g.endFill();

                    container.addChild(shape);
                    this.lines.push(shape);

                    midLength += length + lengthBetweenLines;
                }
            }
        }

        // :: Container :: //
        addToStage(container);

        return container;
    }

    /**
     * Position the road in the given position.
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
