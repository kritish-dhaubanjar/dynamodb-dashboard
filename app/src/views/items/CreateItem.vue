<template>
  <div class="row">
    <div class="col-12 col-xl-8" id="edit-item">
      <h3>Create item</h3>
      <p>
        You can add, remove, or edit the attributes of an item. You can nest
        attributes inside other attributes up to 32 levels deep.
      </p>
      <textarea ref="textAreaRef" />

      <br />
      <br />
      <br />

      <div class="alert alert-primary rounded-0" role="alert" v-if="!hasKeys">
        You must provide the partition key attribute metricId with a non-empty
        value.
      </div>

      <div class="d-flex justify-content-end">
        <button
          class="btn btn-primary rounded-0"
          type="button"
          :disabled="!isValid || !hasKeys || store.ui.state.isLoading"
          @click="create"
        >
          <span
            v-if="store.ui.state.isLoading"
            class="spinner-grow spinner-grow-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span class="visually-hidden">Loading...</span>
          Create Item
        </button>

        <button
          type="button"
          class="btn btn-secondary rounded-0 ms-2"
          @click="cancel"
        >
          Cancel
        </button>
      </div>

      <!-- Toast -->
      <div
        class="toast-container position-fixed top-0 start-50 translate-middle-x p-3"
      >
        <div
          class="toast align-items-center border-0"
          :class="toast.className"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          ref="toastRef"
        >
          <div class="d-flex">
            <div class="toast-body">{{ toast.message }}</div>
            <button
              type="button"
              class="btn-close btn-close-white me-2 m-auto"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as bootstrap from "bootstrap";

import * as CodeMirror from "codemirror";
import { linter } from "@codemirror/lint";
import { oneDark } from "@codemirror/theme-one-dark";
import { json, jsonParseLinter } from "@codemirror/lang-json";

import { useRoute, useRouter } from "vue-router";
import { computed, inject, onMounted, reactive, ref, watch } from "vue";

import { getTable } from "@/services/table";
import { createItem } from "@/services/item";

export default {
  setup() {
    let cm;
    const item = ref("");
    const editItem = ref("");

    const hasKeys = ref(true);
    const isValid = ref(true);

    const toast = reactive({
      className: "text-bg-success",
      message: "The item has been saved successfully.",
    });

    const route = useRoute();
    const router = useRouter();
    const textAreaRef = ref(null);
    const toastRef = ref(null);
    const store = inject("store");

    const cancel = () => {
      if (window.history.length > 1) {
        router.back();
      } else {
        router.push({ name: "home" });
      }
    };

    const getQuery = (originalItem, editedItem) => {
      const q = {};

      try {
        const original = JSON.parse(originalItem);
        const validItem = JSON.parse(editedItem);

        const keys = Object.keys(original);

        keys.forEach((key) => (q[key] = validItem[key]));
      } catch (error) {}

      return q;
    };

    const create = async () => {
      const table = store.table.state.Table;
      const tableName = table.TableName;

      try {
        await createItem(tableName, JSON.parse(editItem.value));

        toast.className = "text-bg-success";
        toast.message = "The item has been saved successfully.";

        setTimeout(() => {
          router.replace({
            name: "edit-item",
            params: { tableName },
            query: getQuery(item.value, editItem.value),
          });
        }, 250);
      } catch (error) {
        toast.className = "text-bg-danger";
        toast.message = error.response.data.message ?? error.message;
      } finally {
        const toastEl = new bootstrap.Toast(toastRef.value, { delay: 5000 });
        setTimeout(() => toastEl.show(), 0);
      }
    };

    watch([item, editItem], ([original, edited]) => {
      isValid.value = false;

      try {
        const validItem = JSON.parse(edited);
        const originalItem = JSON.parse(original);

        isValid.value = true;
        hasKeys.value = true;

        Object.keys(originalItem).forEach(
          (key) => (hasKeys.value &= Object.keys(validItem).includes(key))
        );
      } catch (error) {
        isValid.value = false;
      }
    });

    // https://codemirror.net/
    onMounted(async () => {
      const Theme = CodeMirror.EditorView.theme({
        ".cm-line, .cm-line span": {
          "font-size": "13px",
          "font-weight": "bold",
          "font-family": "'Fira Code', monospace !important",
        },
      });

      cm = editorFromTextArea(textAreaRef.value, [
        CodeMirror.basicSetup,
        json(),
        linter(jsonParseLinter()),
        Theme,
        oneDark,
        CodeMirror.EditorView.updateListener.of((update) => {
          editItem.value = update.state.doc.toString();
        }),
      ]);

      await initItem();

      cm.dispatch({
        changes: {
          from: 0,
          to: cm.state.doc.length,
          insert: item.value + "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
        },
      });
    });

    const initItem = async () => {
      const { tableName } = route.params;
      const table = await getTable(tableName);
      const { KeySchema, AttributeDefinitions } = table;

      const emptyItem = {};

      KeySchema.forEach(({ AttributeName }) => {
        const { AttributeType } = AttributeDefinitions.find(
          (attributeDefinition) =>
            attributeDefinition.AttributeName === AttributeName
        );

        emptyItem[AttributeName] = AttributeType === "S" ? "" : 0;
      });

      item.value = JSON.stringify(emptyItem, null, 2);
      store.table.setters.setTable(table);
    };

    const editorFromTextArea = (textarea, extensions) => {
      const view = new CodeMirror.EditorView({
        doc: JSON.stringify("", null, "\t"),
        extensions,
      });
      textarea.parentNode.insertBefore(view.dom, textarea);
      textarea.style.display = "none";

      return view;
    };

    return {
      store,
      textAreaRef,
      isValid,
      hasKeys,
      toast,
      toastRef,
      cancel,
      create,
    };
  },
};
</script>
