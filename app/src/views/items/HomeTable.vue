<template>
  <div class="row">
    <div class="col-xl-2 col-lg-3 col-4 mb-4">
      <TableList :activeTableName="activeTableName" />
    </div>

    <div class="col-xl-10 col-lg-9 col-8">
      <div class="d-flex justify-content-between">
        <h3 class="mb-4">
          {{ store.table.state.Table.TableName }}
          <small class="fs-6">({{ store.table.state.Table.ItemCount ?? 0 }})</small>
        </h3>

        <div>
          <button
            class="ms-3 btn btn-outline-primary dropdown-toggle btn-sm rounded-0"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Actions
          </button>
          <ul class="dropdown-menu rounded-0">
            <li>
              <a
                href="#"
                class="dropdown-item"
                @click.prevent
                data-bs-toggle="modal"
                data-bs-target="#delete-table-modal"
              >
                Delete Table
              </a>
              <a
                href="#"
                class="dropdown-item"
                @click.prevent
                data-bs-toggle="modal"
                data-bs-target="#truncate-table-modal"
              >
                Truncate Table
              </a>
              <RouterLink
                v-if="activeTableName"
                class="dropdown-item"
                :to="{
                  name: 'edit-table',
                  params: { tableName: activeTableName },
                }"
              >
                Create/Delete Index
              </RouterLink>
              <RouterLink
                v-if="activeTableName"
                class="dropdown-item"
                :to="{
                  name: 'table-schema',
                  params: { tableName: activeTableName },
                }"
              >
                View Table Schema
              </RouterLink>

              <RouterLink
                v-if="activeTableName"
                class="dropdown-item"
                :to="{
                  name: 'table-ttl',
                  params: { tableName: activeTableName },
                }"
              >
                Time to Live (TTL)
              </RouterLink>
            </li>
          </ul>

          <RouterLink to="/table/create-table">
            <button class="btn btn-outline-primary btn-sm rounded-0 ms-2">Create Table</button>
          </RouterLink>

          <RouterLink to="/table/restore-tables">
            <button class="btn btn-outline-primary btn-sm rounded-0 ms-2">Restore Tables</button>
          </RouterLink>
        </div>
      </div>

      <br />

      <TableFilter />

      <br />

      <div class="table-container bg-white shadow-sm">
        <ItemList
          ref="tableRef"
          :action="action"
          @reset="action = ''"
          :count="selection.count"
          :isSelected="selection.isSelected"
          @unselect="
            selection.count = 0;
            selection.isSelected = false;
          "
        >
          <br />
          <RetrieveNext
            :disabled="store.ui.state.isLoading"
            @next="fetchHandler"
          />

          <TableActions 
            @action="(type) => (action = type)" 
            :table-ref="tableRef"
          />

          <div class="d-flex justify-content-between align-items-center px-4 py-3">
            <div class="d-flex">
              <div v-if="store.ui.state.table.selectedRows > 0">
                <strong>
                  {{ selection.isSelected ? `${selection.count} ` : `${store.ui.state.table.selectedRows} ` }}
                </strong>

                <span v-if="store.ui.state.table.selectedRows > 1">items</span>
                <span v-else>item</span>
                selected
              </div>

              <div
                class="ms-3"
                v-if="
                  store.ui.state.table.selectedRows > 0 &&
                  (store.ui.state.table.count !== store.ui.state.table.selectedRows ||
                    store.dynamodb.state.ExclusiveStartKey)
                "
              >
                <button
                  class="btn btn-outline-primary py-0 px-2"
                  @click="selectAll"
                >
                  <span v-if="selection.isSelected">Clear selection</span>
                  <span v-else>Select all items</span>
                </button>
              </div>
            </div>

            <TablePaginate @next="fetchHandler" />
          </div>
        </ItemList>
      </div>
    </div>

    <!--  -->
    <div
      id="truncate-table-modal"
      class="modal"
      tabindex="-1"
      ref="truncateModalRef"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Truncate table</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">
              You are about to truncate
              <b>{{ activeTableName }}</b>
              table.
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary rounded-0"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>

            <button
              class="btn btn-danger rounded-0"
              type="button"
              :disabled="store.ui.state.isLoading"
              @click="truncate"
            >
              <span
                v-if="store.ui.state.isLoading"
                class="spinner-grow spinner-grow-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Loading...</span>
              Truncate Table
            </button>
          </div>
        </div>
      </div>
    </div>

    <!--  -->
    <div
      id="delete-table-modal"
      class="modal"
      tabindex="-1"
      ref="deleteModalRef"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete table</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">
              You are about to delete
              <b>{{ activeTableName }}</b>
              table.
            </p>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary rounded-0"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>

            <button
              class="btn btn-danger rounded-0"
              type="button"
              :disabled="store.ui.state.isLoading"
              @click="destroy"
            >
              <span
                v-if="store.ui.state.isLoading"
                class="spinner-grow spinner-grow-sm"
                role="status"
                aria-hidden="true"
              ></span>
              <span class="visually-hidden">Loading...</span>
              Delete Table
            </button>
          </div>
        </div>
      </div>
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
</template>

<script setup lang="ts">
  import * as bootstrap from "bootstrap";
  import { useRoute, useRouter } from "vue-router";
  import { computed, inject, onBeforeMount, onMounted, reactive, ref, watch } from "vue";

  import { deleteTable, truncateTable, getTable, getTables } from "@/services/table";
  import { scanItems, queryItems, countItems } from "@/services/item";
  import { generateDynamodbParameters } from "@/utils/table";

  import type table from "@/store/table";

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

  const tableRef = ref<{
    clear: () => void;
    selectedItem: Array<object>;
  }>({
    clear: () => {},
    selectedItem: []
  });
  const selection = reactive({ count: 0, isSelected: false });

  const activeTableName = ref("");

  const rows = computed(() => store.ui.state.table.rows);
  const limit = computed(() => store.dynamodb.state.Limit);

  const prefetchedPageCount = computed(() => Math.ceil(rows.value.length / limit.value));

  const fetchHandler = async () => {
    selection.count - 0;
    selection.isSelected = false;

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
      store.ui.setters.setTable(table, [...rows, ...data.Items], data.Count, data.ScannedCount);
    } catch (error: any) {
      toast.className = "text-bg-danger";
      toast.message = error.response.data.message ?? error.message;
      const toastEl = new bootstrap.Toast(toastRef.value, { delay: 5000 });
      setTimeout(() => toastEl.show(), 0);
    }
  };

  onBeforeMount(async () => {
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
    const defaultOperation = ["SCAN", "QUERY"].includes(operation ?? "") ? operation : "SCAN";

    const defaultIndexName = table.GlobalSecondaryIndexes?.map(
      ({ IndexName }: { IndexName: string }) => IndexName,
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
      route.query.requestId, // diff requests
    ],

    async ([tableName, _limit, _page, _parameters, _indexName, requestId], oldValues) => {
      selection.count - 0;
      selection.isSelected = false;

      if (!tableName) return;

      // @TABLE
      const [old_tableName, old_limit, old_page, old_parameters, old_indexName, old_requestId] = oldValues ?? [];

      {
        if (tableName !== old_tableName) {
          // @RESET
          store.dynamodb.setters.init({});
          store.ui.setters.setTable({}, []);
          activeTableName.value = tableName?.toString();

          // @INIT
          try {
            const table = await getTable(tableName.toString());
            store.table.setters.setTable(table);
          } catch (error) {
            window.location.href = "/";
          }
        }
      }

      if (!_parameters) {
        store.dynamodb.setters.reset();
      }

      if (old_parameters !== _parameters || old_indexName !== _indexName || old_requestId !== requestId) {
        const parameters = JSON.parse(decodeURIComponent(_parameters?.toString() ?? "{}"));

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
        let pageCount = 0;

        if (!store.dynamodb.state.ExclusiveStartKey) {
          store.ui.setters.setTable({}, []);
        }

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

    { immediate: true },
  );

  //
  const action = ref("");

  const deleteModal = ref(null);
  const truncateModal = ref(null);

  const deleteModalRef = ref(null);
  const truncateModalRef = ref(null);

  const destroy = async () => {
    try {
      await deleteTable(activeTableName.value);
      deleteModal.value?.hide();
      window.location.href = "/";
    } catch (error) {
      toast.className = "text-bg-danger";
      toast.message = error.response.data.message ?? error.message;
      const toastEl = new bootstrap.Toast(toastRef.value, { delay: 5000 });
      setTimeout(() => toastEl.show(), 0);
    }
  };

  const truncate = async () => {
    try {
      await truncateTable(activeTableName.value);

      const table = await getTable(activeTableName.value);
      store.table.setters.setTable(table);
      store.ui.setters.setTable({}, []); // Clear the current table data

      // Reset pagination and fetch new data
      store.ui.setters.setPage(1);
      store.dynamodb.setters.setExclusiveStartKey(null);
      await fetchHandler();

      truncateModal.value?.hide();
    } catch (error) {
      toast.className = "text-bg-danger";
      toast.message = error.response.data.message ?? error.message;
      const toastEl = new bootstrap.Toast(toastRef.value, { delay: 5000 });
      setTimeout(() => toastEl.show(), 0);
    }
  };

  const selectAll = async () => {
    if (selection.isSelected) {
      selection.count = 0;
      selection.isSelected = false;
      tableRef.value.clear();

      return;
    }

    const table = store.table.state.Table;
    const dynamodb = store.dynamodb.state;

    try {
      const data = await countItems(table.TableName, dynamodb);

      selection.count = data.Count;
      selection.isSelected = true;
    } catch (error) {
      toast.className = "text-bg-danger";
      toast.message = error.response.data.message ?? error.message;
      const toastEl = new bootstrap.Toast(toastRef.value, { delay: 5000 });
      setTimeout(() => toastEl.show(), 0);
    }
  };

  onMounted(() => {
    deleteModal.value = new bootstrap.Modal(deleteModalRef.value, {});
    truncateModal.value = new bootstrap.Modal(truncateModalRef.value, {});
  });
</script>

<style lang="scss" scoped>
  .dropdown-menu {
    z-index: 2048 !important;
  }
</style>
