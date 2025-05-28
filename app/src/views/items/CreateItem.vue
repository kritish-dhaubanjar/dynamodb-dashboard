<template>
  <div class="row">
    <div
      class="col-12 col-xl-8"
      id="edit-item"
    >
      <h3>Create item</h3>
      <p>
        You can add, remove, or edit the attributes of an item. You can nest attributes inside other attributes up to 32
        levels deep.
      </p>

      <div class="vh-60">
        <textarea ref="textAreaRef" />
      </div>

      <div
        class="alert alert-danger rounded-0"
        role="alert"
        v-if="!!errorMsg"
      >
        {{ errorMsg }}
      </div>

      <div
        class="alert alert-primary rounded-0"
        role="alert"
        v-if="!hasKeys"
      >
        You must provide the partition key attribute with a non-empty value.
      </div>

      <br />
      <br />
      <br />

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
      <div class="toast-container position-fixed top-0 start-50 translate-middle-x p-3">
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

<script lang="ts">
  import * as bootstrap from "bootstrap";

  import { useRoute, useRouter } from "vue-router";
  import { inject, onMounted, reactive, ref, watch } from "vue";

  import { getTable } from "@/services/table";
  import { createItem } from "@/services/item";
  import codeMirrorConfig from "./codeMirrorConfig";

  export default {
    setup() {
      let codeMirror;
      const item = ref("{}");
      const editItem = ref("{}");
      const errorMsg = ref("");

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
        } catch (error) {
          void 0;
        }

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
        errorMsg.value = "";

        try {
          const validItem = JSON.parse(edited);
          const originalItem = JSON.parse(original);

          isValid.value = true;
          hasKeys.value = true;

          Object.keys(originalItem).forEach((key) => (hasKeys.value &= Object.keys(validItem).includes(key)));
        } catch (error) {
          isValid.value = false;
          errorMsg.value = error.message;
        }
      });

      // https://codemirror.net/
      onMounted(async () => {
        codeMirror = codeMirrorConfig(textAreaRef, editItem);

        await initItem();

        codeMirror.dispatch({
          changes: {
            from: 0,
            to: codeMirror.state.doc.length,
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
            (attributeDefinition) => attributeDefinition.AttributeName === AttributeName,
          );

          emptyItem[AttributeName] = AttributeType === "S" ? "" : 0;
        });

        item.value = JSON.stringify(emptyItem, null, 2);
        store.table.setters.setTable(table);
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
        errorMsg,
      };
    },
  };
</script>
