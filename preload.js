const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("lectureCode", {
    copyImage: (dataUrl) => {
        return ipcRenderer.invoke("clipboard:copy-image", dataUrl);
    }
});