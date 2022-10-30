import * as CodeMirror from "codemirror";

import { linter, lintGutter } from "@codemirror/lint";
import { oneDark } from "@codemirror/theme-one-dark";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import type { Extension } from "@codemirror/state";

const Theme = CodeMirror.EditorView.theme({
  ".cm-line, .cm-line span": {
    "font-size": "13px",
    "font-weight": "bold",
    "font-family": "'Fira Code', monospace !important",
  },
  ".cm-tooltip": {
    "background-color": "#fafafa",
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editorFromTextArea = (textarea: any, extensions: Extension[]) => {
  const view = new CodeMirror.EditorView({
    doc: JSON.stringify("", null, "\t"),
    extensions,
  });
  textarea.parentNode.insertBefore(view.dom, textarea);
  textarea.style.display = "none";

  return view;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const codeMirrorConfig = (textAreaRef: any, editItem: any) => {
  const instance = editorFromTextArea(textAreaRef.value, [
    CodeMirror.basicSetup,
    json(),
    linter(jsonParseLinter()),
    lintGutter(),
    Theme,
    oneDark,
    CodeMirror.EditorView.updateListener.of((update) => {
      editItem.value = update.state.doc.toString();
    }),
  ]);
  return instance;
};

export default codeMirrorConfig;
