<template>
  <div class="sticky-top table-actions bg-white">
    <slot></slot>

    <div class="d-flex">
      <div class="ms-3 overflow-hidden shadow-sm min-width-min-content table-responsive">
        <table
          ref="table"
          class="mb-0 position-relative table table-hover table-bordered"
        >
          <thead>
            <tr class="shadow-sm border-top-0 border-bottom-0">
              <th
                scope="col"
                :style="`min-width: ${widths[0]}px`"
              >
                <input
                  class="form-check-input mt-1"
                  type="checkbox"
                  value=""
                  aria-label="Checkbox for following text input"
                  :checked="selectedItems.length > 0"
                  @change="toggle"
                  :indeterminate="selectedItems.length > 0 && selectedItems.length < items.length"
                />
              </th>

              <th
                scope="col"
                :key="key"
                @click="setSort(headers[0])"
                :style="`min-width: ${widths[1]}px`"
              >
                <span class="text-nowrap">
                  {{ headers[0] }}
                  <span v-if="sort.key === headers[0]">
                    <i
                      v-show="sort.order === SORT_ORDER.DESC"
                      class="bi bi-arrow-down"
                    ></i>
                    <i
                      v-show="sort.order === SORT_ORDER.ASC"
                      class="bi bi-arrow-up"
                    ></i>
                  </span>
                </span>
              </th>

              <th
                scope="col"
                :style="`min-width: ${widths[2]}px`"
              >
                <i
                  class="bi bi-eye me-2 text-white"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  data-bs-title="Preview"
                />
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <div
        class="table-responsive me-3 overflow-hidden shadow-sm w-100"
        ref="tableHeaderContainer"
      >
        <table
          ref="table"
          class="mb-0 position-relative table table-hover table-bordered"
        >
          <thead>
            <tr class="shadow-sm border-top-0 border-bottom-0">
              <th
                v-for="(key, index) in headers.slice(1)"
                scope="col"
                :key="key"
                @click="setSort(key)"
                :style="`min-width: ${widths[index + 3]}px`"
              >
                <span class="text-nowrap">
                  {{ key }}
                  <span v-if="sort.key === key">
                    <i
                      v-show="sort.order === SORT_ORDER.DESC"
                      class="bi bi-arrow-down"
                    ></i>
                    <i
                      v-show="sort.order === SORT_ORDER.ASC"
                      class="bi bi-arrow-up"
                    ></i>
                  </span>
                </span>
              </th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  </div>

  <section class="position-relative d-flex">
    <div
      class="ms-3"
      ref="twocolumns"
    >
      <table class="mb-0 position-relative table table-hover table-bordered">
        <thead>
          <tr class="shadow-sm border-top-0 border-bottom-0">
            <th scope="col">
              <input
                class="form-check-input mt-1"
                type="checkbox"
                value=""
                aria-label="Checkbox for following text input"
                :checked="selectedItems.length > 0"
                @change="toggle"
                :indeterminate="selectedItems.length > 0 && selectedItems.length < items.length"
              />
            </th>
            <th
              scope="col"
              :key="headers[0]"
              @click="setSort(key)"
            >
              <span class="text-nowrap">
                {{ headers[0] }}
                <span v-if="sort.key === headers[0]">
                  <i
                    v-show="sort.order === SORT_ORDER.DESC"
                    class="bi bi-arrow-down"
                  ></i>
                  <i
                    v-show="sort.order === SORT_ORDER.ASC"
                    class="bi bi-arrow-up"
                  ></i>
                </span>
              </span>
            </th>
          </tr>
        </thead>

        <tbody ref="metatbody">
          <tr
            :class="{ 'table-primary': find(item) > -1 }"
            v-for="item in items"
            :key="item[pk.AttributeName] + (sk ? item[sk.AttributeName] : '')"
            @click="(e) => handleItemSelect(e, item)"
          >
            <td>
              <input
                class="form-check-input mt-1"
                type="checkbox"
                value=""
                aria-label="Checkbox for following text input"
                @change="select(item)"
                :checked="find(item) > -1"
              />
            </td>

            <td
              :key="headers[0]"
              class="text-nowrap"
            >
              <i
                class="bi bi-clipboard2 me-2"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-title="Copy to clipboard"
                @click="copy(item[headers[0]])"
              ></i>

              <!--  -->
              <RouterLink
                :to="handleItem(item)"
                class="card-link text-decoration-none"
              >
                {{ item[headers[0]] }}
              </RouterLink>
            </td>

            <td>
              <i
                class="bi bi-eye me-2"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-title="Preview"
                @click="offcanvas(item)"
              ></i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      class="table-responsive me-3 w-100"
      ref="tableContainer"
      @scroll="handleScrollbarPosition"
    >
      <table
        ref="table"
        class="mb-0 position-relative table table-hover table-bordered"
      >
        <thead>
          <tr class="shadow-sm border-top-0 border-bottom-0">
            <th
              v-for="key in headers.slice(1)"
              scope="col"
              :key="key"
              @click="setSort(key)"
            >
              <span class="text-nowrap">
                {{ key }}
                <span v-if="sort.key === key">
                  <i
                    v-show="sort.order === SORT_ORDER.DESC"
                    class="bi bi-arrow-down"
                  ></i>
                  <i
                    v-show="sort.order === SORT_ORDER.ASC"
                    class="bi bi-arrow-up"
                  ></i>
                </span>
              </span>
            </th>
          </tr>
        </thead>

        <tbody ref="tbody">
          <tr
            :class="{ 'table-primary': find(item) > -1 }"
            v-for="item in items"
            :key="item[pk.AttributeName] + (sk ? item[sk.AttributeName] : '')"
            @click="(e) => handleItemSelect(e, item)"
          >
            <td
              v-for="(key, index) in headers.slice(1)"
              :key="key"
            >
              <div>{{ item[key] }}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <div
    class="scrollbar-container overflow-x-scroll sticky-bottom me-3"
    @scroll="handleScroll"
    ref="scrollcontainer"
  >
    <hr
      ref="scrollbar"
      class="m-0"
    />
  </div>

  <div class="hide-double-scrollbar bg-white w-100 position-relative"></div>

  <!--  -->
  <div
    class="modal"
    tabindex="-1"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Delete {{ count || selectedItems.length }} items</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>
            Delete
            <b>{{ count || selectedItems.length }}</b>
            item from the
            <b>{{ store.table.state.Table.TableName }}</b>
            table? This action cannot be reversed.
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
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Offcanvas -->
  <div
    class="offcanvas offcanvas-end vw-30"
    tabindex="-1"
    id="offcanvas"
    ref="offcanvasRef"
  >
    <div class="offcanvas-body p-0">
      <div class="h-100">
        <textarea
          readonly
          ref="textAreaRef"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { throttle } from "lodash";
  import * as bootstrap from "bootstrap";
  import { useRouter } from "vue-router";
  import { destroyItems, truncateItems } from "@/services/item";
  import { openSearchPanel } from "@codemirror/search";
  import codeMirrorConfig from "@/views/items/codeMirrorConfig";
  import { computed, inject, onMounted, ref, watch, watchEffect, reactive, nextTick } from "vue";

  import { SORT_ORDER, SORTS } from "../../constants/sort";

  const props = defineProps({
    action: String,
    isSelected: Boolean,
    count: Number,
  });

  const router = useRouter();
  const store: any = inject("store");
  const emit = defineEmits(["reset", "unselect"]);

  const sort = reactive({
    key: null,
    order: null,
  } as {
    key: null | string;
    order: null | string;
  });

  const selectedItems = ref([]);

  const headers = computed(() => store.ui.state.table.headers ?? []);

  const items = computed(() => {
    // TODO: Fix this
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    selectedItems.value = [];

    const { Limit } = store.dynamodb.state;
    const { rows, page } = store.ui.state.table;

    const sortedRows = sortItems(rows);

    return sortedRows.slice((page - 1) * Limit, page * Limit);
  });

  /* SORT */
  const sortItems = (items = []) => {
    if (!sort.key || !sort.order) return items;

    return [...items].sort((a, b) => {
      const v1 = (sort.key && a[sort.key]) || "";
      const v2 = (sort.key && b[sort.key]) || "";

      if (sort.order === SORT_ORDER.ASC) {
        if (v1 > v2) return 1;
        if (v1 < v2) return -1;
        return 0;
      }

      if (sort.order === SORT_ORDER.DESC) {
        if (v1 > v2) return -1;
        if (v1 < v2) return 1;
        return 0;
      }

      return 0;
    });
  };

  const setSort = (key: any) => {
    const index = SORTS.findIndex((order) => order === sort.order);

    if (sort.key === key) {
      sort.order = SORTS[(index + 1) % SORTS.length];
    } else {
      sort.key = key;
      sort.order = SORTS[1];
    }
  };
  /* SORT */

  /* SCROLL */
  const row = ref(null);
  const table = ref(null);
  const tbody = ref(null);
  const scrollbar = ref(null);
  const twocolumns = ref(null);
  const tableContainer = ref(null);
  const scrollcontainer = ref(null);
  const tableHeaderContainer = ref(null);

  const metatbody = ref(null);

  watchEffect(() => {
    if (props.isSelected) {
      selectedItems.value = [...items.value];
    }
  });

  watch(
    () => items.value,
    async () => {
      await nextTick(() => {
        // TODO: Fix the TS issue
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        scrollbar.value.style.width = `${+table.value.scrollWidth}px`;
        scrollcontainer.value.style.marginLeft = `${+twocolumns.value.scrollWidth + 14}px`;
      });
    },
  );

  watch(
    selectedItems,
    (items) => {
      store.ui.setters.setSelectedRows(items.length);
    },
    { immediate: true, deep: true },
  );

  /* RESIZE */
  const widths = ref([]);

  watch(
    () => items.value,
    async () => {
      await nextTick(() => {
        const metarows = metatbody.value?.getElementsByTagName("tr")?.[0];
        const metacells = metarows?.getElementsByTagName("td");

        const rows = tbody.value?.getElementsByTagName("tr")?.[0];
        const cells = rows?.getElementsByTagName("td");

        if (cells && metacells) {
          widths.value = [...metacells, ...cells].map((td) => td.getBoundingClientRect()?.width);
        }
      });
    },
  );
  /* RESIZE */

  const handleScrollbarPosition = throttle((event) => {
    scrollcontainer.value?.scroll({ left: event.target.scrollLeft });
    tableHeaderContainer.value?.scroll({ left: event.target.scrollLeft });
  }, 0.5);

  const handleScroll = throttle((event) => {
    tableContainer.value?.scroll({ left: event.target.scrollLeft });
    tableHeaderContainer.value?.scroll({ left: event.target.scrollLeft });
  }, 0.5);

  // Tooltip
  watch(
    () => items.value,
    () => {
      setTimeout(() => {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          return new bootstrap.Tooltip(tooltipTriggerEl);
        });
      }, 0);
    },
  );

  const pk = computed(() => store.table.state.Table.KeySchema.find(({ KeyType }) => KeyType === "HASH"));
  const sk = computed(() => store.table.state.Table.KeySchema.find(({ KeyType }) => KeyType === "RANGE"));

  const modal = ref(null);
  const modalRef = ref(null);
  const offcanvasRef = ref(null);
  const textAreaRef = ref(null);
  const codeMirrorRef = ref(null);

  onMounted(() => {
    modal.value = new bootstrap.Modal(modalRef.value, {});
    codeMirrorRef.value = codeMirrorConfig(textAreaRef, {}, true);
  });

  const handleItem = (item: object) => {
    const table = store.table.state.Table;
    const tableName = table.TableName;

    return {
      name: "edit-item",
      params: { tableName },
      query: {
        ...(pk.value && {
          [pk.value.AttributeName]: item[pk.value.AttributeName],
        }),
        ...(sk.value && {
          [sk.value.AttributeName]: item[sk.value.AttributeName],
        }),
      },
    };
  };

  const find = (item: any) => {
    const index = selectedItems.value.findIndex((_item) => {
      const pkMatch = pk.value ? _item[pk.value.AttributeName] === item[pk.value.AttributeName] : true;

      const skMatch = sk.value ? _item[sk.value.AttributeName] === item[sk.value.AttributeName] : true;

      return pkMatch && skMatch;
    });

    return index;
  };

  const select = (item: any) => {
    emit("unselect");

    const index = find(item);

    if (index > -1) {
      selectedItems.value.splice(index, 1);
    } else {
      selectedItems.value.push(item);
    }
  };

  const toggle = () => {
    emit("unselect");

    if (selectedItems.value.length) selectedItems.value = [];
    else selectedItems.value = [...items.value];
  };

  const clear = () => {
    selectedItems.value = [];
  };

  watchEffect(() => {
    if (props.action && selectedItems.value.length) {
      if (props.action === "EDIT") {
        selectedItems.value.forEach((item) => {
          const route = router.resolve(handleItem(item));
          window.open(route.href, "_blank");
        });
      }

      if (props.action === "DELETE") {
        modal.value.show();
      }
    }

    emit("reset", "");
  });

  const destroy = async () => {
    const table = store.table.state.Table;
    const tableName = table.TableName;
    const dynamodb = store.dynamodb.state;

    if (props.isSelected) {
      await truncateItems(tableName, dynamodb);

      store.ui.setters.setTable(table, []);
    } else {
      const payload = [];

      selectedItems.value.forEach((item) => {
        const { query } = handleItem(item);
        payload.push(query);
      });

      await destroyItems(tableName, payload);

      const filteredRows = store.ui.state.table.rows.filter((item) => {
        const index = find(item);
        return index === -1;
      });

      store.ui.setters.setTable(table, [...filteredRows]);
    }

    modal.value.hide();
  };

  const copy = (partitionKey) => {
    navigator.clipboard.writeText(partitionKey);
  };

  const offcanvas = (item) => {
    const bsOffcanvas = new bootstrap.Offcanvas(offcanvasRef.value);

    const href = handleItem(item);

    codeMirrorRef.value.dispatch({
      changes: {
        from: 0,
        to: codeMirrorRef.value.state.doc.length,
        insert: JSON.stringify(item, null, 2),
      },
    });

    openSearchPanel(codeMirrorRef.value);

    bsOffcanvas.show();
  };

  const handleItemSelect = (event, item) => {
    if (event.detail === 3) {
      select(item);
      // clear selection
      window.getSelection()?.empty() && window.getSelection()?.removeAllRanges();
    }
  };

  defineExpose({ clear, selectedItems });
</script>

<style scoped lang="scss">
  section {
    top: -38px;
  }

  td div {
    overflow: hidden;
    max-width: 428px;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-height: 25px !important;
  }

  i:hover {
    cursor: pointer;
  }

  th {
    cursor: pointer;
  }

  .table-responsive {
    border-top: 1px solid #e3e3e3;

    thead {
      tr {
        top: 0;
        position: sticky;
        background: #fff;
      }
    }
  }

  .scrollbar-container {
    height: 16px;

    z-index: 1;
    top: 0;
    left: 0;
    right: 0;

    hr {
      border-color: transparent;
    }
  }

  .hide-double-scrollbar {
    height: 48px;
    z-index: 2;
    top: -48px;
  }

  .table-actions {
    z-index: 1026;
  }
</style>
