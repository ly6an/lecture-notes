import { basicSetup } from "codemirror";
import { Compartment, EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";

import { languages, examples } from "./language.js";

const languageCompartment = new Compartment();

const editorTheme = EditorView.theme(
    {
        "&": {
            height: "100%",
            color: "#e6edf3",
            backgroundColor: "#0f1117"
        },

        ".cm-content": {
            padding: "18px 0",
            fontFamily: '"Cascadia Code", Consolas, monospace',
            fontSize: "15px"
        },

        ".cm-gutters": {
            color: "#596273",
            backgroundColor: "#0f1117",
            border: "none"
        },

        ".cm-activeLine": {
            backgroundColor: "#171b24"
        },

        ".cm-activeLineGutter": {
            backgroundColor: "#171b24"
        },

        ".cm-cursor": {
            borderLeftColor: "#ffffff"
        },

        "&.cm-focused .cm-selectionBackground, ::selection": {
            backgroundColor: "#31446d"
        }
    },
    {
        dark: true
    }
);

export function createEditor(parentElement) {
    const startState = EditorState.create({
        doc: examples.javascript,

        extensions: [
            basicSetup,
            keymap.of([indentWithTab]),
            languageCompartment.of(
                languages.javascript.extension
            ),
            editorTheme
        ]
    });

    return new EditorView({
        state: startState,
        parent: parentElement
    });
}

export function setEditorLanguage(editor, languageKey) {
    const language = languages[languageKey];

    if (!language) {
        throw new Error(`Unknown language: ${languageKey}`);
    }

    editor.dispatch({
        effects: languageCompartment.reconfigure(
            language.extension
        )
    });
}