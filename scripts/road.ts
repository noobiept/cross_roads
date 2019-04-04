import { getCanvasDimensions, addToStage, removeFromStage } from "./main.js";
import { GameElement } from "./game.js";

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

        this.positionIn(0, canvas.height / 2 - this.height / 2);
    }

    setupShape() {
        const canvas = getCanvasDimensions();
        var container = new createjs.Container();

        var g, a;
        var linesColor = "black";
        var sideWalkColor = "gray";
        var lineHeight = 1;
        var width = canvas.width;

        // :: Side walks :: //

        for (a = 0; a < this.side_walks.length; a++) {
            var sideWalk = new createjs.Shape();

            g = sideWalk.graphics;

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
        var middleLineLength = 20;
        var lengthBetweenLines = middleLineLength / 2;

        for (a = 0; a < this.lanes; a++) {
            // see if the next lane is not a sidewalk
            // that means we need to add a middle line
            if (
                this.side_walks.indexOf(a) < 0 &&
                this.side_walks.indexOf(a + 1) < 0
            ) {
                var midLength = 0;
                var length;

                while (midLength < width) {
                    if (midLength + middleLineLength < width) {
                        length = middleLineLength;
                    } else {
                        length = width - midLength;
                    }

                    var shape = new createjs.Shape();

                    g = shape.graphics;

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

    positionIn(x: number, y: number) {
        this.container.x = x;
        this.container.y = y;
    }

    clear() {
        removeFromStage(this.container);
        this.lines.length = 0;
    }

    laneToY(lane: number) {
        return this.getY() + lane * Road.LANE_HEIGHT + Road.LANE_HEIGHT / 2;
    }

    getX() {
        return this.container.x;
    }

    getY() {
        return this.container.y;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }
}
