<template>
  <div class="row">
    <div class="col-xl-2 mb-4">
      <TableList :activeTableName="activeTableName" />
    </div>

    <div class="col-xl-10">
      <h3 class="mb-4">
        {{ store.table.state.Table.TableName }}
      </h3>

      <br />

      <div class="bg-white shadow-sm">
        <br />
        <RetrieveNext
          v-if="
            store.dynamodb.state.ExclusiveStartKey && !store.ui.state.isLoading
          "
        />

        <TablePaginate />

        <ItemList />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { getTable, getTables } from "@/services/table";
import { scanItems } from "@/services/item";

import TableList from "../components/app/table-list.vue";
import ItemList from "../components/app/item-list.vue";
import RetrieveNext from "../components/app/retrieve-next.vue";
import TablePaginate from "../components/app/table-paginate.vue";

const store: any = inject("store");

const route = useRoute();
const router = useRouter();

const activeTableName = ref("");

onBeforeMount(async () => {
  const { searchParams } = new URL(window.location.toString());

  const limit = searchParams.get("limit");
  const tableName = searchParams.get("tableName");

  const tables = await getTables();

  const defaultLimit = parseInt(limit) || 50;
  const defaultTable = tableName ?? tables[0];

  store.dynamodb.setters.setLimit(defaultLimit);

  router.push({
    name: "home",
    query: {
      ...route.query,
      limit: defaultLimit,
      tableName: defaultTable,
    },
  });

  store.table.setters.setTableNames(tables);
});

router.afterEach(async () => {
  if (route.name === "home") {
    const tableName: any = route.query.tableName?.toString();
    activeTableName.value = tableName;

    // Reset dynamodb & page
    store.dynamodb.setters.init({});
    store.ui.setters.setPage(1);

    const [table, data] = await Promise.all([
      getTable(tableName),
      scanItems(tableName, store.dynamodb.state),
    ]);

    store.dynamodb.setters.init(data);
    store.table.setters.setTable(table);
    store.ui.setters.setTable(table, data.Items);
  }
});
</script>
