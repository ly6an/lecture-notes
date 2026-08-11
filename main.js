console.log("MY MAIN.JS IS RUNNING");

const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
    console.log("Creating window...");
    
    const window = new BrowserWindow({
        width: 1200,
        height: 800
    });

    const indexPath = path.join(__dirname, "src", "index.html");

    console.log("Loading:", indexPath);

    window.loadFile(indexPath);
}

app.whenReady().then(() => {
    createWindow();
});