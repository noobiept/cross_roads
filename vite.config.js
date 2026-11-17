import { defineConfig } from "vite";
import packageJson from "./package.json" with { type: "json" };

export default defineConfig({
    base: "",
    build: {
        outDir: `release/${packageJson.name} ${packageJson.version}`,
    },
    test: {
        // the game needs a page (its menu, and the canvas)
        environment: "jsdom",
        include: ["source/**/*.test.ts"],
    },
});
