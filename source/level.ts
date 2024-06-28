import * as Game from "./game.js";
import * as Message from "./message.js";
import Car, { CarType } from "./car.js";
import Road, { RoadInfo } from "./road.js";
import Player from "./player.js";
import Explosion from "./explosion.js";
import { getCanvasDimensions, getCarInfo } from "./main.js";
import { boxBoxCollision, deepClone } from "@drk4/utilities";

export interface CarsInLevelInfo {
    type: CarType;
    start_seconds: number;
    spawn_interval_seconds: number;
    lane: number;
    count: number;
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
    private count_duration: number;
    private cars_info: CarsInLevelInfo[];
    private active_cars_info: CarsInLevelInfo[];
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

        // counts the time since the level started (useful to know when to start adding the cars)
        this.count_duration = 0;

        // has the info of the cars to be added (which lane, spawn interval, etc)
        // these still haven't started
        this.cars_info = deepClone(info.cars);

        for (var a = 0; a < this.cars_info.length; a++) {
            this.cars_info[a].count = 0;

            // start the level already with some cars in the road
            var carInfo = this.cars_info[a];
            var carTypeInfo = getCarInfo(carInfo.type);
            var xStep = carTypeInfo.speed * carInfo.spawn_interval_seconds;

            // starting 'x'
            var x =
                carTypeInfo.speed *
                (carInfo.spawn_interval_seconds - carInfo.start_seconds);

            while (x < canvas.width) {
                var car = new Car({
                    x: x,
                    y: this.road.laneToY(carInfo.lane),
                    type: carInfo.type,
                    level: this,
                });

                this.cars.push(car);

                x += xStep;
            }
        }

        // this will have the same info there is in .cars_info (it will be moved to here), once it is active (the level duration has passed the .start_seconds property)
        this.active_cars_info = [];

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
        for (var a = 0; a < this.cars.length; a++) {
            this.cars[a].clear();
        }

        this.cars.length = 0;
        this.count_duration = 0;

        this.road.clear();
    }

    /**
     * Gets called in the game loop.
     * Adds the new cars on the set interval, checks for collisions, etc.
     */
    tick(event: createjs.TickerEvent) {
        var delta = event.delta / 1000; // in seconds
        this.count_duration += delta;

        // check if we need to activate any car info
        for (let a = this.cars_info.length - 1; a >= 0; a--) {
            const info = this.cars_info[a];

            if (this.count_duration >= info.start_seconds) {
                this.active_cars_info.push(info);
                this.cars_info.splice(a, 1);

                const car = new Car({
                    y: this.road.laneToY(info.lane),
                    type: info.type,
                    level: this,
                });

                this.cars.push(car);
            }
        }

        // add new cars, according to its spawn interval
        for (let a = 0; a < this.active_cars_info.length; a++) {
            const info = this.active_cars_info[a];

            info.count += delta;

            if (info.count >= info.spawn_interval_seconds) {
                const car = new Car({
                    y: this.road.laneToY(info.lane),
                    type: info.type,
                    level: this,
                });

                this.cars.push(car);

                info.count = 0;
            }
        }

        if (this.checkCollisions()) {
            Message.show("Collision!", 500);

            // center the explosion around the player
            const explosion = new Explosion();
            const centeredPosition = Game.centerElement(this.player, explosion);
            explosion.positionIn(centeredPosition);

            // no more new lives
            if (!this.newLife()) {
                Game.clear();
                Message.show("No more lives, you loose!", 2000, function () {
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
        var player = this.player;
        var cars = this.cars;

        for (var a = 0; a < cars.length; a++) {
            var car = cars[a];

            var collision = boxBoxCollision(
                player.getX(),
                player.getY(),
                player.getWidth(),
                player.getHeight(),
                car.getX(),
                car.getY(),
                car.getWidth(),
                car.getHeight()
            );

            if (collision) {
                return true;
            }
        }

        return false;
    }

    /**
     * Remove a `car` from the game.
     */
    removeCar(car: Car) {
        var index = this.cars.indexOf(car);
        this.cars.splice(index, 1);

        car.clear();
    }
}
