<template>
  <div
    class="alert alert-primary rounded-0 mx-3 d-flex align-items-center justify-content-between"
    role="alert"
  >
    <p class="mb-0">
      This table has more items to retrieve. To retrieve the next page of items,
      choose Retrieve next page.
    </p>

    <div>
      <button
        type="button"
        class="btn btn-outline-secondary btn-sm rounded-0"
        @click="nextHandler"
      >
        Retrieve next page
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { scanItems } from "@/services/item";
import { inject } from "vue";

const store: any = inject("store");

const nextHandler = async () => {
  const dynamodb = store.dynamodb.state;
  const table = store.table.state.Table;
  const rows = store.ui.state.table.rows;

  const tableName = table.TableName;

  const data = await scanItems(tableName, dynamodb);

  store.dynamodb.setters.init(data);
  store.ui.setters.setTable(table, [...rows, ...data.Items]);
};
</script>
