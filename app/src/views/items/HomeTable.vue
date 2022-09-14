<template>
  <div class="row">
    <div class="col-xl-2 col-lg-3 col-4 mb-4">
      <TableList :activeTableName="activeTableName" />
    </div>

    <div class="col-xl-10 col-lg-9 col-8">
      <div class="d-flex justify-content-between">
        <h3 class="mb-4">
          {{ store.table.state.Table.TableName }}
        </h3>

        <div>
          <button class="btn btn-outline-secondary btn-sm rounded-0">
            Actions
          </button>

          <RouterLink to="/table/create-table">
            <button class="btn btn-outline-primary btn-sm rounded-0 ms-2">
              Create Table
            </button>
          </RouterLink>
        </div>
      </div>

      <br />

      <TableFilter />

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
</template>

<script setup lang="ts">
import * as bootstrap from "bootstrap";
import { useRoute, useRouter } from "vue-router";
import { computed, inject, onBeforeMount, reactive, ref, watch } from "vue";

import { getTable, getTables } from "@/services/table";
import { scanItems, queryItems } from "@/services/item";
import { generateDynamodbParameters } from "@/utils/table";

import ItemList from "@/components/app/item-list.vue";
import TableList from "@/components/app/table-list.vue";
import TableFilter from "@/components/app/table-filter.vue";
import RetrieveNext from "@/components/app/retrieve-next.vue";
import TableActions from "@/components/app/table-actions.vue";
import TablePaginate from "@/components/app/table-paginate.vue";

const route = useRoute();
const router = useRouter();
const store: any = inject("store");

const toastRef = ref(null);
const toast = reactive({
  className: "text-bg-danger",
  message: "",
});

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

  let data;

  try {
    // SCAN/QUERY
    if (route.query.operation === "QUERY") {
      data = await queryItems(table.TableName, dynamodb);
    } else {
      data = await scanItems(table.TableName, dynamodb);
    }

    store.dynamodb.setters.init({ ...dynamodb, ...data });
    store.ui.setters.setTable(table, [...rows, ...data.Items]);
  } catch (error: any) {
    toast.className = "text-bg-danger";
    toast.message = error.response.data.message ?? error.message;
    const toastEl = new bootstrap.Toast(toastRef.value, { delay: 5000 });
    setTimeout(() => toastEl.show(), 0);
  }
};

onBeforeMount(async () => {
  console.info(`@onBeforeMount`);
  const query = {
    ...route.query,
  };

  const { searchParams } = new URL(window.location.toString());

  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const tableName = searchParams.get("tableName");
  const tables = await getTables();

  const defaultPage = parseInt(page ?? "1");
  const defaultLimit = parseInt(limit ?? "50");
  const defaultTable = tableName ?? tables[0];

  const operation = searchParams.get("operation");
  const indexName = searchParams.get("indexName");

  // FORCE INVALID REQ -> VALID REQ
  const table = await getTable(defaultTable);
  const defaultOperation = ["SCAN", "QUERY"].includes(operation ?? "")
    ? operation
    : "SCAN";

  const defaultIndexName = table.GlobalSecondaryIndexes?.map(
    ({ IndexName }: { IndexName: string }) => IndexName
  ).includes(indexName)
    ? indexName
    : defaultTable;

  let defaultParameters = searchParams.get("parameters")?.toString() ?? null;

  try {
    JSON.parse(decodeURIComponent(defaultParameters));
  } catch (err) {
    delete query["parameters"];
    defaultParameters = null;
  }

  router.push({
    name: "home",
    query: {
      ...query,
      page: defaultPage,
      limit: defaultLimit,
      tableName: defaultTable,
      //
      indexName: defaultIndexName,
      operation: defaultOperation,
      parameters: defaultParameters,
    },
  });

  store.table.setters.setTableNames(tables);
});

watch(
  () => [
    route.query.tableName,
    route.query.limit,
    route.query.page,
    route.query.parameters,
    route.query.indexName,
  ],

  async ([tableName, _limit, _page, _parameters, _indexName], oldValues) => {
    console.log({ tableName, _limit, _page, _parameters, _indexName });

    if (!tableName) return;

    // @TABLE
    const [old_tableName, old_limit, old_page, old_parameters, old_indexName] =
      oldValues ?? [];

    {
      if (tableName !== old_tableName) {
        // @RESET
        store.dynamodb.setters.init({});
        store.ui.setters.setTable({}, []);
        activeTableName.value = tableName?.toString();

        // @INIT
        const table = await getTable(tableName.toString());
        store.table.setters.setTable(table);
      }
    }

    if (!_parameters) {
      store.dynamodb.setters.reset();
    }

    if (old_parameters !== _parameters || old_indexName !== _indexName) {
      const parameters = JSON.parse(
        decodeURIComponent(_parameters?.toString() ?? "{}")
      );

      const dynamodb = { ...store.dynamodb.state };

      const dynamodbParameters = generateDynamodbParameters({
        parameters,
        table: store.table.state.Table,
        indexName: _indexName,
      });

      store.ui.setters.setTable({}, []);

      store.dynamodb.setters.init({
        // ...dynamodb,
        ...dynamodbParameters,
      });
    }

    // @ITEMS
    {
      if (!(_limit && _page)) return;
      const limit = parseInt(_limit.toString());
      const page = parseInt(_page.toString());

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
