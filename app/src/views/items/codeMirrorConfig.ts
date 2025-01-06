import * as CodeMirror from "codemirror";

import { keymap } from "@codemirror/view";
import { search } from "@codemirror/search";
import { oneDark } from "@codemirror/theme-one-dark";
import { linter, lintGutter } from "@codemirror/lint";
import { json, jsonParseLinter } from "@codemirror/lang-json";
import { indentWithTab, defaultKeymap } from "@codemirror/commands";

import type { Extension } from "@codemirror/state";

const Theme = CodeMirror.EditorView.theme({
  ".cm-line, .cm-line span": {
    "font-size": "13px",
    "font-weight": "bold",
    "font-family": "'JetBrains Mono', monospace !important",
  },
  ".cm-tooltip": {
    "background-color": "#fafafa",
  },
  // https://discuss.codemirror.net/t/code-editor-with-automatic-height-that-has-a-minimum-and-maximum-height/4015/5
  "&": { maxHeight: "100%", height: "100%" },
  ".cm-gutter,.cm-content": { minHeight: "100%" },
  ".cm-scroller": { overflow: "auto" },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editorFromTextArea = (textarea: any, extensions: Extension[]) => {
  const view = new CodeMirror.EditorView({
    doc: JSON.stringify({}, null, "\t"),
    extensions,
  });
  textarea.parentNode.insertBefore(view.dom, textarea);
  textarea.style.display = "none";

  return view;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const codeMirrorConfig = (textAreaRef: any, editItem: any, isReadOnly: boolean = false) => {
  const instance = editorFromTextArea(textAreaRef.value, [
    CodeMirror.basicSetup,
    json(),
    linter(jsonParseLinter()),
    lintGutter(),
    search({ top: true }),
    Theme,
    oneDark,
    CodeMirror.EditorView.updateListener.of((update) => {
      if (editItem) {
        editItem.value = update.state.doc.toString();
      }
    }),
    keymap.of([...defaultKeymap, indentWithTab]),
    CodeMirror.EditorView.editable.of(!isReadOnly), // Set the editor to read-only
  ]);

  return instance;
};

export default codeMirrorConfig;
