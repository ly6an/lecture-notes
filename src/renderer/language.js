import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { sql } from "@codemirror/lang-sql";

export const languages = {
    javascript: {
        name: "JavaScript",
        extension: javascript()
    },

    python: {
        name: "Python",
        extension: python()
    },

    java: {
        name: "Java",
        extension: java()
    },

    cpp: {
        name: "C++",
        extension: cpp()
    },

    html: {
        name: "HTML",
        extension: html()
    },

    css: {
        name: "CSS",
        extension: css()
    },

    sql: {
        name: "SQL",
        extension: sql()
    }
};

export const examples = {
    javascript: `function hello(name) {
    console.log("Hello, " + name);
}

hello("Lecture");`,

    python: `def hello(name):
    print("Hello, " + name)

hello("Lecture")`,

    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Lecture");
    }
}`,

    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, Lecture" << endl;
    return 0;
}`,

    html: `<main>
    <h1>Hello, Lecture</h1>
</main>`,

    css: `body {
    background: #111318;
    color: white;
}`,

    sql: `SELECT name, course
FROM students
WHERE course = 'Computer Science';`
};