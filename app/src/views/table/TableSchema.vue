<template>
  <div class="row">
    <div class="col-12 col-xl-11">
      <h3 class="mb-3">{{ route.params.tableName }} Description</h3>

      <div class="card rounded-0 border-0 shadow-sm">
        <div class="card-header py-3 border-0">
          <h4 class="mb-1">Getting information about a table</h4>
          <small>
            DynamoDB tables are schemaless—other than the primary key, you do not need to define any extra attributes or
            data types when you create a table.
          </small>
          <div class="row">
            <div class="col-6">
              <ul>
                <li>
                  <small>
                    TableName – Name of the table.
                  </small>
                </li>
                <li>
                  <small>
                    KeySchema – Attributes that are used for the primary key. For more information, see Tables, items,
                    and
                    attributes and Primary key.
                  </small>
                </li>
              </ul>
            </div>
            <div class="col-6">
              <ul>
                <li>
                  <small>
                    AttributeDefinitions – Data types for the key schema attributes.
                  </small>
                </li>
                <li>
                  <small>
                    ProvisionedThroughput (for provisioned tables) – Number of reads and writes per second that you need
                    for
                    this table.
                  </small>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <textarea ref="textAreaRef" />
      </div>

      <br />

      <div class="d-flex justify-content-end">
        <button type="button" class="btn btn-secondary rounded-0 me-2" @click="cancel">
          Cancel
        </button>

        <button class="btn btn-primary rounded-0" type="button" @click="copy">
          <i class="bi bi-clipboard2 me-2" /> Copy to Clipboard
        </button>
      </div>
    </div>


    <div class="toast-container position-fixed top-0 start-50 translate-middle-x p-3">
      <div class="toast align-items-center border-0 text-bg-success" role="alert" aria-live="assertive"
        aria-atomic="true" ref="toastRef">
        <div class="d-flex">
          <div class="toast-body">{{ route.params.tableName }} Schema copied to clipboard</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"
            aria-label="Close"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import * as bootstrap from "bootstrap";

import codeMirrorConfig from "../items/codeMirrorConfig";

import { onMounted, ref } from "vue";
import { getTable } from "@/services/table";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const toastRef = ref(null);

const schema = ref("{}")

const textAreaRef = ref(null);

onMounted(async () => {
  try {
    const codeMirror = codeMirrorConfig(textAreaRef, {});

    const data = await getTable(route.params.tableName.toString());
    schema.value = JSON.stringify({ Table: data }, null, 2)

    codeMirror.dispatch({
      changes: {
        from: 0,
        to: codeMirror.state.doc.length,
        insert: schema.value + "\n\n\n\n\n",
      },
    });
  } catch (error) {
    window.location.href = "/";
  }
});

const cancel = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: "home" });
  }
};

const copy = () => {
  navigator.clipboard.writeText(schema.value);
  const toastEl = new bootstrap.Toast(toastRef.value, { delay: 5000 });
  setTimeout(() => toastEl.show(), 0);
};
</script>
