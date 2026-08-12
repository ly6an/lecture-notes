const { defineConfig } = require("vite");
const { VitePWA } = require("vite-plugin-pwa");

module.exports = defineConfig({
    root: "src",
    base: "./",

    plugins: [
        VitePWA({
            registerType: "autoUpdate",

            manifest: {
                name: "LectureCode",
                short_name: "LectureCode",

                description:
                    "Turn lecture code into clean, annotatable images.",

                theme_color: "#111318",
                background_color: "#111318",
                display: "standalone",
                orientation: "any",
                start_url: "./",
                scope: "./"
            },

            workbox: {
                maximumFileSizeToCacheInBytes:
                    10 * 1024 * 1024
            }
        })
    ],

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