<template>
  <div class="table-responsive mx-3">
    <table class="table table-hover table-bordered">
      <thead>
        <tr class="shadow-sm border-top-0">
          <th scope="col">
            <input
              class="form-check-input mt-1"
              type="checkbox"
              value=""
              aria-label="Checkbox for following text input"
              :checked="selectedItems.length > 0"
              @change="toggle"
              :indeterminate="
                selectedItems.length > 0 && selectedItems.length < items.length
              "
            />
          </th>
          <th
            v-for="key in headers"
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
      <tbody>
        <tr
          :class="{ 'table-primary': find(item) > -1 }"
          v-for="item in items"
          :key="item[pk.AttributeName] + (sk ? item[sk.AttributeName] : '')"
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

          <td v-for="(key, index) in headers" :key="key">
            <div v-if="index === 0">
              <i
                class="bi bi-clipboard2 me-2"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                data-bs-title="Copy to clipboard"
                @click="copy(item[key])"
              ></i>
              <!--  -->
              <RouterLink
                :to="handleItem(item)"
                class="card-link text-decoration-none"
              >
                {{ item[key] }}
              </RouterLink>
            </div>
            <div v-else>{{ item[key] }}</div>
          </td>
        </tr>
      </tbody>
    </table>

    <!--  -->
    <div class="modal" tabindex="-1" ref="modalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Delete {{ selectedItems.length }} items</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Delete <b>{{ selectedItems.length }}</b> item from the
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
  </div>
</template>

<script setup lang="ts">
import * as bootstrap from "bootstrap";
import { useRouter } from "vue-router";
import { destroyItems } from "@/services/item";
import {
  computed,
  inject,
  onMounted,
  ref,
  watch,
  watchEffect,
  reactive,
} from "vue";

import { SORT_ORDER, SORTS } from "../../constants/sort";

const props = defineProps({
  action: String,
});

const router = useRouter();
const store: any = inject("store");
const emit = defineEmits(["reset"]);

const sort = reactive({
  key: null,
  order: null,
});

const selectedItems = ref([]);

const headers = computed(() => store.ui.state.table.headers ?? []);
const items = computed(() => {
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
    const v1 = a[sort.key] ?? "";
    const v2 = b[sort.key] ?? "";

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

const setSort = (key) => {
  const index = SORTS.findIndex((order) => order === sort.order);

  if (sort.key === key) {
    sort.order = SORTS[(index + 1) % SORTS.length];
  } else {
    sort.key = key;
    sort.order = SORTS[1];
  }
};
/* SORT */

// Tooltip
watch(
  () => items.value,
  () => {
    setTimeout(() => {
      const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }, 0);
  }
);

const pk = computed(() =>
  store.table.state.Table.KeySchema.find(({ KeyType }) => KeyType === "HASH")
);
const sk = computed(() =>
  store.table.state.Table.KeySchema.find(({ KeyType }) => KeyType === "RANGE")
);

const modal = ref(null);
const modalRef = ref(null);

onMounted(() => {
  modal.value = new bootstrap.Modal(modalRef.value, {});
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
    const pkMatch = pk.value
      ? _item[pk.value.AttributeName] === item[pk.value.AttributeName]
      : true;

    const skMatch = sk.value
      ? _item[sk.value.AttributeName] === item[sk.value.AttributeName]
      : true;

    return pkMatch && skMatch;
  });

  return index;
};

const select = (item: any) => {
  const index = find(item);

  if (index > -1) {
    selectedItems.value.splice(index, 1);
  } else {
    selectedItems.value.push(item);
  }
};

const toggle = () => {
  if (selectedItems.value.length) selectedItems.value = [];
  else selectedItems.value = [...items.value];
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

  modal.value.hide();
};

const copy = (partitionKey) => {
  navigator.clipboard.writeText(partitionKey);
};
</script>

<style scoped lang="scss">
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
  max-height: 700px;
  thead {
    tr {
      top: 0;
      position: sticky;
      background: #fff;
    }
  }
}
</style>
