import { EditorView, basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";

const editorElement = document.getElementById("editor");

const startState = EditorState.create({
    doc: `function hello(name) {
    console.log("Hello " + name);
}

hello("Lecture");`,

    extensions: [
        basicSetup,
        javascript()
    ]
});

new EditorView({
    state: startState,
    parent: editorElement
});