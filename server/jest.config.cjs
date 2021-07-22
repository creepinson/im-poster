module.exports = {
    // [...]
    preset: "ts-jest/presets/js-with-babel-esm",
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1"
    },
    testPathIgnorePatterns: ["data", "dist"],
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    extensionsToTreatAsEsm: [".ts"],
    globals: {
        "ts-jest": {
            useESM: true,
            babelConfig: true
        }
    }
};
