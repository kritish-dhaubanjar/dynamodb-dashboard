<template>
  <div class="row">
    <div class="col-xl-2 col-lg-3 col-4 mb-4">
      <TableList :activeTableName="activeTableName" />
    </div>

    <div class="col-xl-10 col-lg-9 col-8">
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
          @next="fetchHandler"
        />

        <TableActions @action="(type) => (action = type)" />

        <TablePaginate @next="fetchHandler" />

        <ItemList :action="action" @reset="action = ''" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, inject, onBeforeMount, ref, watch } from "vue";

import { scanItems } from "@/services/item";
import { getTable, getTables } from "@/services/table";

import ItemList from "../components/app/item-list.vue";
import TableList from "../components/app/table-list.vue";
import RetrieveNext from "../components/app/retrieve-next.vue";
import TableActions from "../components/app/table-actions.vue";
import TablePaginate from "../components/app/table-paginate.vue";

const route = useRoute();
const router = useRouter();
const store: any = inject("store");

const activeTableName = ref("");

const rows = computed(() => store.ui.state.table.rows);
const limit = computed(() => store.dynamodb.state.Limit);

const prefetchedPageCount = computed(() =>
  Math.ceil(rows.value.length / limit.value)
);

const fetchHandler = async () => {
  const dynamodb = store.dynamodb.state;
  const table = store.table.state.Table;
  const rows = store.ui.state.table.rows;

  const data = await scanItems(table.TableName, dynamodb);

  store.dynamodb.setters.init(data);
  store.ui.setters.setTable(table, [...rows, ...data.Items]);
};

onBeforeMount(async () => {
  const { searchParams } = new URL(window.location.toString());

  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const tableName = searchParams.get("tableName");

  const tables = await getTables();

  const defaultPage = parseInt(page ?? "1");
  const defaultLimit = parseInt(limit ?? "50");
  const defaultTable = tableName ?? tables[0];

  router.push({
    name: "home",
    query: {
      ...route.query,
      page: defaultPage,
      limit: defaultLimit,
      tableName: defaultTable,
    },
  });

  store.table.setters.setTableNames(tables);
});

watch(
  () => [route.query.tableName, route.query.limit, route.query.page],
  async ([tableName, _limit, _page], [old_tableName] = [undefined]) => {
    if (!tableName) return;

    // @TABLE
    {
      if (tableName !== old_tableName) {
        console.log("@watch #route.query.tableName", { tableName });

        // @RESET
        store.dynamodb.setters.init({});
        store.ui.setters.setTable({}, []);
        activeTableName.value = tableName?.toString();

        // @INIT
        const table = await getTable(tableName.toString());
        store.table.setters.setTable(table);
      }
    }

    // @ITEMS
    {
      if (!(_limit && _page)) return;
      const limit = parseInt(_limit.toString());
      const page = parseInt(_page.toString());

      console.log("@watch #route.query.[limit/page]", { limit, page });

      store.ui.setters.setPage(page);
      store.dynamodb.setters.setLimit(limit);

      // @OPTIMIZE
      if (prefetchedPageCount.value >= page) return;

      // @RESET
      store.ui.setters.setTable({}, []);
      let pageCount = 0;

      // @INIT
      do {
        pageCount++;
        await fetchHandler();
        if (!store.dynamodb.state.ExclusiveStartKey) break;
      } while (pageCount < page);

      if (page > pageCount) {
        // Illegal Request -> Legal Request
        router.push({
          name: "home",
          query: { ...route.query, page: pageCount },
        });
      }
    }
  },

  { immediate: true }
);

//
const action = ref("");
</script>

<style scoped></style>
