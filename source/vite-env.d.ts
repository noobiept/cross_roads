/// <reference types="vite/client" />

// CreateJS ships its types as separate ambient `@types/*` packages that each
// declare the global `createjs` namespace. TypeScript 6 no longer auto-includes
// `@types` packages the way TS 5 did, so they must be referenced explicitly here.
/// <reference types="createjs-lib" />
/// <reference types="easeljs" />
/// <reference types="tweenjs" />
/// <reference types="preloadjs" />
/// <reference types="soundjs" />
