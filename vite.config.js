const { defineConfig } = require("vite");

module.exports = defineConfig({
    root: "src",
    base: "./",

    server: {
        host: "127.0.0.1", 
        port: 5173,
        strictPort: true
    },

    build: {
        outDir: "../dist",
        emptyOutDir: true
    }
});