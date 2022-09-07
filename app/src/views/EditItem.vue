<template>
  <div class="row">
    <div class="col-12 col-xl-8">
      <h3>Edit item</h3>

      <p>
        You can add, remove, or edit the attributes of an item. You can nest
        attributes inside other attributes up to 32 levels deep.
      </p>
      <textarea ref="textAreaRef" />
      <br />

      <div class="d-flex justify-content-end">
        <button type="button" class="btn btn-primary rounded-0">
          Save Changes
        </button>
        <button type="button" class="btn btn-secondary rounded-0 ms-2">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import * as CodeMirror from "codemirror";
import { inject, onMounted, ref } from "vue";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";

export default {
  setup() {
    const textAreaRef = ref(null);
    const store = inject("store");

    onMounted(() => {
      const Theme = CodeMirror.EditorView.theme({
        ".cm-line span": {
          "font-family": "Monospace !important",
          "font-weight": "bold",
        },
      });

      const view = editorFromTextArea(textAreaRef.value, [
        CodeMirror.basicSetup,
        json(),
        Theme,
        oneDark,
      ]);
    });

    const editorFromTextArea = (textarea, extensions) => {
      const view = new CodeMirror.EditorView({
        doc: JSON.stringify("", null, "\t"),
        extensions,
      });
      textarea.parentNode.insertBefore(view.dom, textarea);
      textarea.style.display = "none";
      return view;
    };

    return { store, textAreaRef };
  },
};
</script>
