export function removeScannedLineNumbers(text) {
    return text
        .split("\n")
        .map((line) => {
            if (/^\s*\d+\s*$/.test(line)) {
                return "";
            }

            return line.replace(
                /^\s*\d+(?:(?:\s*[|:.]\s?)|[ \t])/,
                ""
            );
        })
        .join("\n");
}

export function detectProgrammingLanguage(code) {
    const scores = {
        javascript: 0,
        python: 0,
        java: 0,
        cpp: 0,
        html: 0,
        css: 0,
        sql: 0
    };

    const tests = {
        javascript: [
            [/\b(const|let|var)\b/g, 2],
            [/\bfunction\s+\w+\s*\(/g, 3],
            [/console\.log\s*\(/g, 4],
            [/=>/g, 2]
        ],

        python: [
            [/\bdef\s+\w+\s*\(/g, 4],
            [/\b(print|input)\s*\(/g, 3],
            [/\b(import|from)\s+\w+/g, 2],
            [/^\s*(if|for|while|def|class).+:\s*$/gm, 3]
        ],

        java: [
            [/\bpublic\s+class\b/g, 5],
            [/\bpublic\s+static\s+void\s+main\b/g, 6],
            [/System\.out\.print/g, 5],
            [/\b(String|boolean|ArrayList)\b/g, 2]
        ],

        cpp: [
            [/#include\s*</g, 6],
            [/\bstd::/g, 4],
            [/\b(cout|cin)\s*<</g, 5],
            [/\busing\s+namespace\s+std/g, 5]
        ],

        html: [
            [/<!DOCTYPE\s+html>/gi, 8],
            [/<(html|head|body|main|div|span|h1|p)\b/gi, 4],
            [/<\/\w+>/g, 2]
        ],

        css: [
            [/[.#][\w-]+\s*\{/g, 4],
            [/\b(color|background|display|margin|padding)\s*:/g, 3],
            [/@media\b/g, 4]
        ],

        sql: [
            [/\bSELECT\b/gi, 5],
            [/\bFROM\b/gi, 4],
            [/\bWHERE\b/gi, 4],
            [/\b(INSERT INTO|UPDATE|CREATE TABLE|DELETE FROM)\b/gi, 6]
        ]
    };

    for (const [language, languageTests] of Object.entries(tests)) {
        for (const [pattern, points] of languageTests) {
            const matches = code.match(pattern);

            if (matches) {
                scores[language] += matches.length * points;
            }
        }
    }

    const [detectedLanguage, score] =
        Object.entries(scores).sort((a, b) => b[1] - a[1])[0];

    return score > 0 ? detectedLanguage : null;
}