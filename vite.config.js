import { defineConfig } from "vite";
import packageJson from "./package.json";

export default defineConfig({
    build: {
        outDir: `release/${packageJson.name} ${packageJson.version}`,
    },
});
