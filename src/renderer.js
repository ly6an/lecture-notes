const codeInput = document.getElementById("codeInput");
const languageSelect = document.getElementById("language");
const generateButton = document.getElementById("generate");
const preview = document.getElementById("preview");


generateButton.addEventListener("click", () => {

    const code = codeInput.value;

    const language = languageSelect.value;

    console.log("Code:", code);

    console.log("Language:", language);

    preview.innerHTML = `
        <pre>${escapeHtml(code)}</pre>
    `;

});


function escapeHtml(text) {

    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}