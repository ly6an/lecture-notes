const isDevelopment = !app.isPackaged;

const {
    app,
    BrowserWindow,
    clipboard,
    ipcMain,
    nativeImage
} = require("electron");

const path = require("path");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    if (isDevelopment) {
        mainWindow.loadFile(
        path.join(__dirname, "src", "index.html")
    );
    } else {
        mainWindow.loadFile(
        path.join(__dirname, "src", "index.html")
    );}
}

ipcMain.handle("clipboard:copy-image", (event, dataUrl) => {
    if (
        typeof dataUrl !== "string" ||
        !dataUrl.startsWith("data:image/png;base64,")
    ) {
        throw new Error("Invalid image data.");
    }

    const image = nativeImage.createFromDataURL(dataUrl);

    if (image.isEmpty()) {
        throw new Error("Could not create the image.");
    }

    clipboard.writeImage(image);

    return true;
});


app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});