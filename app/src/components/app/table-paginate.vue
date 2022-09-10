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
            <RouterLink
              class="page-link rounded-0"
              :class="{
                active: store.ui.state.table.page === page,
                disabled: store.ui.state.isLoading,
              }"
              :to="{ name: 'home', query: { ...route.query, page } }"
              >{{ page }}</RouterLink
            >
          </li>
          <li
            class="page-item"
            :class="{ disabled: store.ui.state.isLoading }"
            v-if="store.dynamodb.state.ExclusiveStartKey"
          >
            <a
              class="page-link rounded-0"
              href="#"
              @click.prevent="emit('next')"
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
            <RouterLink
              class="dropdown-item"
              :to="{ name: 'home', query: { ...route.query, limit } }"
              :class="{ active: limit === store.dynamodb.state.Limit }"
              >{{ limit }} items</RouterLink
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { computed, inject } from "vue";

const emit = defineEmits(["next"]);

const route = useRoute();
const store: any = inject("store");

const rows = computed(() => store.ui.state.table.rows);
const limit = computed(() => store.dynamodb.state.Limit);

const pages = computed(() => Math.ceil(rows.value.length / limit.value));
</script>
