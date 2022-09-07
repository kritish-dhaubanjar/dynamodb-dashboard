<template>
  <div class="px-4 py-3 d-flex align-items-center justify-content-between">
    <h5>
      Items returned
      <span class="text-muted">({{ rows.length }})</span>

      <div
        class="spinner-border spinner-border-sm ms-3"
        role="status"
        v-if="store.ui.state.isLoading"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </h5>

    <div class="d-flex">
      <nav aria-label="Page navigation example">
        <ul class="pagination pagination-sm">
          <li class="page-item" v-for="page in pages" :key="page">
            <a
              class="page-link rounded-0"
              href="#"
              :class="{
                active: store.ui.state.table.page === page,
                disabled: store.ui.state.isLoading,
              }"
              @click.prevent="setPage(page)"
              >{{ page }}</a
            >
          </li>
          <li
            class="page-item"
            :class="{ disabled: store.ui.state.isLoading }"
            v-if="store.dynamodb.state.ExclusiveStartKey"
          >
            <a class="page-link rounded-0" href="#" @click.prevent="nextHandler"
              >...</a
            >
          </li>
        </ul>
      </nav>

      <div class="dropdown ms-3">
        <button
          class="btn btn-secondary dropdown-toggle btn-sm rounded-0"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {{ limit }} items
        </button>
        <ul class="dropdown-menu">
          <li v-for="limit in [10, 25, 50, 100, 200, 300]" :key="limit">
            <a
              href="#"
              class="dropdown-item"
              @click.prevent="setLimit(limit)"
              :class="{ active: limit === store.dynamodb.state.Limit }"
              >{{ limit }} items</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { computed, inject } from "vue";
import { scanItems } from "@/services/item";

const route = useRoute();
const router = useRouter();
const store: any = inject("store");

const rows = computed(() => store.ui.state.table.rows);
const limit = computed(() => store.dynamodb.state.Limit);

const pages = computed(() => Math.ceil(rows.value.length / limit.value));

const nextHandler = async () => {
  const dynamodb = store.dynamodb.state;
  const table = store.table.state.Table;
  const rows = store.ui.state.table.rows;

  const tableName = table.TableName;

  const data = await scanItems(tableName, dynamodb);

  store.dynamodb.setters.init(data);
  store.ui.setters.setTable(table, [...rows, ...data.Items]);
};

const setLimit = (limit: number) => {
  router.push({ name: "home", query: { ...route.query, limit: limit } });
  store.dynamodb.setters.setLimit(limit);
};

const setPage = (page: number) => {
  store.ui.setters.setPage(page);
};

// export default {
//   props: {
//     rows: Array,
//     page: Number,
//     limit: Number,
//     isLoading: Boolean,
//     setLimit: Function,
//     setPage: Function,
//     getNextPage: Function,
//     ExclusiveStartKey: Object,
//   },
//   setup(props: any) {
//     const store = inject("store");

//     const rows = toRef(props, "rows");
//     const limit = toRef(props, "limit");

//     const pages = computed(() => Math.ceil(rows.value.length / limit.value));

//     return { pages, store };
//   },
// };
</script>
