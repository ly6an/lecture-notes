function getRequiredElement(id) {
    const element = document.getElementById(id);

    if (!element) {
        throw new Error(`Required UI element not found: #${id}`);
    }

    return element;
}

export const ui = {
    editorElement: getRequiredElement("editor"),
    generateButton: getRequiredElement("generateButton"),
    previewCode: getRequiredElement("previewCode"),
    previewStatus: getRequiredElement("previewStatus"),
    languageSelect: getRequiredElement("languageSelect"),
    languageLabel: getRequiredElement("languageLabel"),
    codeCard: getRequiredElement("codeCard"),
    copyButton: getRequiredElement("copyButton"),
    downloadButton: getRequiredElement("downloadButton"),
    scanButton: getRequiredElement("scanButton"),
    imageInput: getRequiredElement("imageInput")
};