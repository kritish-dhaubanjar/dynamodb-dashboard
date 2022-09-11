<template>
  <div class="px-4 mt-4 d-flex justify-content-between">
    <h5 class="mb-0">
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
      <div class="dropdown ms-3">
        <button
          class="btn btn-outline-primary btn-sm rounded-0"
          type="button"
          @click="reload"
        >
          <i class="bi bi-arrow-clockwise"></i>
        </button>

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
              @click.prevent="emit('action', 'EDIT')"
            >
              Edit Items
            </a>
            <a
              href="#"
              class="dropdown-item"
              @click.prevent="emit('action', 'DELETE')"
            >
              Delete Items
            </a>
          </li>
        </ul>
      </div>

      <button
        type="button"
        class="ms-2 btn btn-outline-primary btn-sm rounded-0"
      >
        Create Item
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from "vue";

const store: any = inject("store");
const emit = defineEmits(["action"]);

const rows = computed(() => store.ui.state.table.rows);

const reload = () => window.location.reload();
</script>
