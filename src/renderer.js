import { toPng } from "html-to-image";
import { createWorker, PSM } from "tesseract.js";

import { codeToHtml } from "shiki";

import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { sql } from "@codemirror/lang-sql";
import { languages } from "./renderer/language.js";
import { ui } from "./renderer/ui.js";
import {
    createEditor,
    setEditorLanguage
} from "./renderer/editor.js";
import {
    removeScannedLineNumbers,
    detectProgrammingLanguage
} from "./renderer/utils/languageDetection.js";

const {
    editorElement,
    generateButton,
    previewCode,
    previewStatus,
    languageSelect,
    languageLabel,
    codeCard,
    copyButton,
    downloadButton,
    scanButton,
    imageInput
} = ui;

const editor = createEditor(editorElement);

async function generatePreview() {
    const code = editor.state.doc.toString();
    const selectedLanguage = languageSelect.value;
    const language = languages[selectedLanguage];

    generateButton.disabled = true;
    generateButton.textContent = "Generating...";
    previewStatus.textContent = "Applying syntax highlighting...";

    try {
        const highlightedHtml = await codeToHtml(code, {
            lang: selectedLanguage,
            theme: "github-dark-default"
        });

        const parsedHtml = new DOMParser().parseFromString(
            highlightedHtml,
            "text/html"
        );

        const shikiCode = parsedHtml.querySelector("code");

        if (!shikiCode) {
            throw new Error("Shiki did not return highlighted code.");
        }

        const highlightedLines =
            shikiCode.querySelectorAll(".line");

        highlightedLines.forEach((line, index) => {
            const lineNumber = parsedHtml.createElement("span");

            lineNumber.className = "preview-line-number";
            lineNumber.textContent = String(index + 1);

            line.prepend(lineNumber);
        });

        previewCode.innerHTML = shikiCode.innerHTML;
        languageLabel.textContent = language.name;

        const lineCount = editor.state.doc.lines;

        previewStatus.textContent =
            `Generated ${lineCount} ${lineCount === 1 ? "line" : "lines"}`;
    } catch (error) {
        console.error(error);

        previewCode.textContent = code;
        previewStatus.textContent = "Could not apply syntax colours";
    } finally {
        generateButton.disabled = false;
        generateButton.textContent = "Generate Preview";
    }
}

function changeLanguage() {
    const selectedLanguage = languageSelect.value;
    const language = languages[selectedLanguage];

    setEditorLanguage(editor, selectedLanguage);

    languageLabel.textContent = language.name;
    previewStatus.textContent = `${language.name} selected`;
}

generateButton.addEventListener("click", generatePreview);
languageSelect.addEventListener("change", changeLanguage);

downloadButton.addEventListener("click", downloadImage);
copyButton.addEventListener("click", copyImage);

generatePreview();


async function createCodeImage() {
    return toPng(codeCard, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: "#0d1117"
    });
}

async function downloadImage() {
    downloadButton.disabled = true;
    downloadButton.textContent = "Creating...";

    try {
        const dataUrl = await createCodeImage();
        const selectedLanguage = languageSelect.value;

        const downloadLink = document.createElement("a");

        downloadLink.download =
            `lecture-code-${selectedLanguage}.png`;

        downloadLink.href = dataUrl;
        downloadLink.click();

        previewStatus.textContent = "PNG downloaded";
    } catch (error) {
        console.error(error);
        previewStatus.textContent = "PNG export failed";
    } finally {
        downloadButton.disabled = false;
        downloadButton.textContent = "Download PNG";
    }
}

async function copyImage() {
    copyButton.disabled = true;
    copyButton.textContent = "Copying...";

    try {
        const dataUrl = await createCodeImage();

        await window.lectureCode.copyImage(dataUrl);

        previewStatus.textContent = "Image copied to clipboard";
        copyButton.textContent = "Copied!";
    } catch (error) {
        console.error(error);
        previewStatus.textContent = "Copy failed";
        copyButton.textContent = "Copy Image";
    } finally {
        copyButton.disabled = false;

        setTimeout(() => {
            copyButton.textContent = "Copy Image";
        }, 1500);
    }
}

let ocrWorkerPromise = null;

function getOcrWorker() {
    if (!ocrWorkerPromise) {
        ocrWorkerPromise = createWorker("eng", 1, {
            logger: (message) => {
                if (
                    message.status === "recognizing text" &&
                    typeof message.progress === "number"
                ) {
                    const percentage =
                        Math.round(message.progress * 100);

                    previewStatus.textContent =
                        `Scanning screenshot: ${percentage}%`;
                }
            }
        });
    }

    return ocrWorkerPromise;
}

// function removeScannedLineNumbers(text) {
//     return text
//         .split("\n")
//         .map((line) => {
//             // A line containing only a line number
//             if (/^\s*\d+\s*$/.test(line)) {
//                 return "";
//             }

//             // Examples removed:
//             // "12 const value = 5;"
//             // "12 | const value = 5;"
//             // "12: const value = 5;"
//             // "12. const value = 5;"
//             return line.replace(
//                 /^\s*\d+(?:(?:\s*[|:.]\s?)|[ \t])/,
//                 ""
//             );
//         })
//         .join("\n");
// }

// function detectProgrammingLanguage(code) {
//     const scores = {
//         javascript: 0,
//         python: 0,
//         java: 0,
//         cpp: 0,
//         html: 0,
//         css: 0,
//         sql: 0
//     };

//     const tests = {
//         javascript: [
//             [/\b(const|let|var)\b/g, 2],
//             [/\bfunction\s+\w+\s*\(/g, 3],
//             [/console\.log\s*\(/g, 4],
//             [/=>/g, 2]
//         ],

//         python: [
//             [/\bdef\s+\w+\s*\(/g, 4],
//             [/\b(print|input)\s*\(/g, 3],
//             [/\b(import|from)\s+\w+/g, 2],
//             [/^\s*(if|for|while|def|class).+:\s*$/gm, 3]
//         ],

//         java: [
//             [/\bpublic\s+class\b/g, 5],
//             [/\bpublic\s+static\s+void\s+main\b/g, 6],
//             [/System\.out\.print/g, 5],
//             [/\b(String|boolean|ArrayList)\b/g, 2]
//         ],

//         cpp: [
//             [/#include\s*</g, 6],
//             [/\bstd::/g, 4],
//             [/\b(cout|cin)\s*<</g, 5],
//             [/\busing\s+namespace\s+std/g, 5]
//         ],

//         html: [
//             [/<!DOCTYPE\s+html>/gi, 8],
//             [/<(html|head|body|main|div|span|h1|p)\b/gi, 4],
//             [/<\/\w+>/g, 2]
//         ],

//         css: [
//             [/[.#][\w-]+\s*\{/g, 4],
//             [/\b(color|background|display|margin|padding)\s*:/g, 3],
//             [/@media\b/g, 4]
//         ],

//         sql: [
//             [/\bSELECT\b/gi, 5],
//             [/\bFROM\b/gi, 4],
//             [/\bWHERE\b/gi, 4],
//             [/\b(INSERT INTO|UPDATE|CREATE TABLE|DELETE FROM)\b/gi, 6]
//         ]
//     };

//     for (const [language, languageTests] of Object.entries(tests)) {
//         for (const [pattern, points] of languageTests) {
//             const matches = code.match(pattern);

//             if (matches) {
//                 scores[language] += matches.length * points;
//             }
//         }
//     }

//     const [detectedLanguage, score] = Object.entries(scores)
//         .sort((first, second) => second[1] - first[1])[0];

//     return score > 0 ? detectedLanguage : null;
// }

async function scanScreenshot(file) {
    scanButton.disabled = true;
    scanButton.textContent = "Scanning...";
    previewStatus.textContent = "Preparing OCR...";

    try {
        const worker = await getOcrWorker();

        await worker.setParameters({
            tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
            preserve_interword_spaces: "1"
        });

        const result = await worker.recognize(file);
        const extractedCode = removeScannedLineNumbers(
            result.data.text
        ).trimEnd();

        if (!extractedCode) {
            throw new Error("No text was found in the screenshot.");
        }

        editor.dispatch({
            changes: {
                from: 0,
                to: editor.state.doc.length,
                insert: extractedCode
            }
        });

        const detectedLanguage =
        detectProgrammingLanguage(extractedCode);

        if (detectedLanguage) {
            languageSelect.value = detectedLanguage;
            changeLanguage();

            previewStatus.textContent =
                `${languages[detectedLanguage].name} detected`;
        } else {
            previewStatus.textContent =
            "Language could not be detected—select it manually";
        }

        previewStatus.textContent =
            "Screenshot extracted—check the code for OCR mistakes";

        await generatePreview();
    } catch (error) {
        console.error(error);

        previewStatus.textContent =
            "Could not extract code from that image";
    } finally {
        scanButton.disabled = false;
        scanButton.textContent = "Scan Screenshot";
        imageInput.value = "";
    }
}

scanButton.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", () => {
    const selectedFile = imageInput.files[0];

    if (selectedFile) {
        scanScreenshot(selectedFile);
    }
});