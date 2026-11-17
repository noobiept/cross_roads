import { describe, expect, test, vi } from "vitest";
import { startGame } from "../tests/helpers.js";
import level9 from "../public/data/levels/level9.json";
import Road from "./road.js";

vi.mock("./main.js", () => import("../tests/fake_main.js"));

// the update rates of the displays players have (the game runs at 1/60, but the level shouldn't depend on it)
const RATES = [1 / 30, 1 / 60, 1 / 144];

/**
 * The `y` of the center of a lane of level 9 (the road is centered on the 600 pixels high canvas).
 */
function laneToY(lane: number) {
    const top = 300 - (level9.road.lanes * Road.LANE_HEIGHT) / 2;

    return top + lane * Road.LANE_HEIGHT + Road.LANE_HEIGHT / 2;
}

describe("the cars", () => {
    test.each(RATES)(
        "each lane spawns a car at its start, then on every interval (updating every %f seconds)",
        async (deltaTime) => {
            const game = await startGame();

            game.Game.nextLevel(9);

            // the cars already on the road when the level starts
            const seen = new Set(game.cars());
            const spawns = new Map<number, number[]>(); // lane y -> spawn times
            const steps = Math.round(10 / deltaTime);

            for (let a = 1; a <= steps; a++) {
                game.Engine.step(deltaTime);

                for (const car of game.cars()) {
                    if (!seen.has(car)) {
                        seen.add(car);

                        const times = spawns.get(car.y) ?? [];
                        times.push(a * deltaTime);
                        spawns.set(car.y, times);
                    }
                }
            }

            for (const lane of level9.cars) {
                const times = spawns.get(laneToY(lane.lane)) ?? [];
                const expected = Math.floor(
                    (10 - lane.start_seconds) / lane.spawn_interval_seconds
                );

                expect(times.length).toBeGreaterThanOrEqual(expected);

                // in the first update at or after the time (at most an update later)
                times.forEach((time, index) => {
                    const scheduled =
                        lane.start_seconds +
                        index * lane.spawn_interval_seconds;

                    expect(time).toBeGreaterThanOrEqual(scheduled - 1e-9);
                    expect(time).toBeLessThanOrEqual(
                        scheduled + deltaTime + 1e-9
                    );
                });
            }
        }
    );

    test("they're taken out once they're past the right edge", async () => {
        const game = await startGame();

        for (let a = 0; a < 20 * 60; a++) {
            game.Engine.step(1 / 60);

            // with its left edge at the right edge of the canvas it's out of sight already (it can
            // be there for an update, since the steps don't always add up exactly to its duration)
            for (const car of game.cars()) {
                expect(car.left).toBeLessThanOrEqual(600);
            }
        }

        // only the ones on the road are kept (level 1 has at most 6 in each of its 3 lanes)
        expect(game.cars().length).toBeLessThanOrEqual(18);
    });
});
