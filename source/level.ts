import * as Game from "./game.js";
import * as Message from "./message.js";
import Car, { CarType } from "./car.js";
import Road, { RoadInfo } from "./road.js";
import Player from "./player.js";
import explode from "./explosion.js";
import { getCanvasDimensions, getCarInfo } from "./main.js";
import * as Engine from "@drk4/game-engine";

export interface CarsInLevelInfo {
    type: CarType;
    start_seconds: number;
    spawn_interval_seconds: number;
    lane: number;
}

/**
 * The cars of a lane: the first one comes at `start_seconds`, then one every `spawn_interval_seconds`.
 */
interface LaneSpawn {
    info: CarsInLevelInfo;
    cooldown: Engine.Cooldown;
}

export interface LevelInfo {
    road: RoadInfo;
    cars: CarsInLevelInfo[];
}

export interface LevelArgs {
    info: LevelInfo;
    player: Player;
}

export default class Level {
    private cars: Car[];
    private road: Road;
    private start_x: number;
    private start_y: number;
    private destination_y: number;
    private spawns: LaneSpawn[];
    private player: Player;

    constructor(args: LevelArgs) {
        const player = args.player;
        const info = args.info;
        const canvas = getCanvasDimensions();

        this.cars = [];
        this.road = new Road(info.road);

        this.start_x = canvas.width / 2 - player.getWidth() / 2;
        this.start_y =
            canvas.height / 2 -
            this.road.getHeight() / 2 -
            player.getHeight() -
            5;

        player.positionIn({ x: this.start_x, y: this.start_y });

        this.spawns = [];

        for (let a = 0; a < info.cars.length; a++) {
            const carInfo = info.cars[a];

            // it waits until the lane starts, then `restart()` sets the spawn interval (keeping the
            // time past the start and each interval, so the gaps between the cars don't depend on the
            // frame rate)
            this.spawns.push({
                info: carInfo,
                cooldown: new Engine.Cooldown(carInfo.start_seconds, {
                    ready: false,
                }),
            });

            // start the level already with some cars in the road (where they'd be if the lane had
            // been spawning them before the level started)
            const carTypeInfo = getCarInfo(carInfo.type);
            const xStep = carTypeInfo.speed * carInfo.spawn_interval_seconds;

            // starting 'x'
            let x =
                carTypeInfo.speed *
                (carInfo.spawn_interval_seconds - carInfo.start_seconds);

            while (x < canvas.width) {
                const car = new Car({
                    x: x,
                    y: this.road.laneToY(carInfo.lane),
                    type: carInfo.type,
                    level: this,
                });

                this.cars.push(car);

                x += xStep;
            }
        }

        // need to move here to pass the level
        this.destination_y =
            this.road.getY() + info.road.lanes * Road.LANE_HEIGHT + 10;

        this.player = player;
    }

    /**
     * Re-position the player on the initial position and remove one life from him.
     * Returns whether the player still has lives left or not.
     */
    newLife() {
        this.player.positionIn({ x: this.start_x, y: this.start_y });
        return this.player.oneLessLife();
    }

    /**
     * Clear the level related elements (cars, road, etc).
     */
    clear() {
        for (let a = 0; a < this.cars.length; a++) {
            this.cars[a].clear();
        }

        this.cars.length = 0;

        this.road.clear();
    }

    /**
     * Gets called in the game loop.
     * Adds the new cars on the set interval, checks for collisions, etc.
     */
    tick(deltaTime: number) {
        // add the new cars (once the lane starts, and then on its spawn interval)
        for (let a = 0; a < this.spawns.length; a++) {
            const spawn = this.spawns[a];
            const info = spawn.info;

            spawn.cooldown.update(deltaTime);

            if (spawn.cooldown.isReady()) {
                spawn.cooldown.restart(info.spawn_interval_seconds);

                const car = new Car({
                    y: this.road.laneToY(info.lane),
                    type: info.type,
                    level: this,
                });

                this.cars.push(car);
            }
        }

        if (this.checkCollisions()) {
            Message.show("Collision!", 0.5);

            // where the player was hit
            const { x, y } = this.player.getShape();
            explode({ x, y });

            // no more new lives
            if (!this.newLife()) {
                Game.clear();
                Message.show("No more lives, you loose!", 2, function () {
                    Game.loadInitialLevel();
                });
                return;
            }
        }

        if (this.player.getY() > this.destination_y) {
            Game.nextLevel();
        }
    }

    /**
     * Check collisions between the player and a car.
     */
    checkCollisions() {
        const player = this.player.getShape();

        return this.cars.some((car) => player.overlaps(car.getShape()));
    }

    /**
     * Remove a `car` from the game.
     */
    removeCar(car: Car) {
        const index = this.cars.indexOf(car);
        this.cars.splice(index, 1);

        car.clear();
    }
}
