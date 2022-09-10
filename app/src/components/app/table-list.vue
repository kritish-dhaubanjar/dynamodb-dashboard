<template>
  <ul class="list-group rounded-0 shadow-sm">
    <li class="list-group-item py-3">
      <h5 class="mb-3">
        Tables
        <span class="text-muted">({{ tableNames.length }})</span>
      </h5>
      <div class="input-group mb-3">
        <span class="input-group-text bg-white rounded-0">@</span>
        <input
          type="text"
          v-model="search"
          class="form-control rounded-0 border-start-0"
          placeholder="Find tables by table name"
        />
      </div>
    </li>

    <li
      class="list-group-item py-2"
      v-for="tableName in tableNames"
      :key="tableName"
    >
      <RouterLink
        :to="{
          name: 'home',
          query: { limit: store.dynamodb.state.Limit, tableName, page: 1 },
        }"
      >
        <div class="form-check">
          <input
            class="form-check-input"
            name="table"
            type="radio"
            :id="tableName"
            :checked="
              tableName ===
              (activeTableName ?? store.table.state.Table.TableName)
            "
          />
          <label class="form-check-label ms-3 text-break" :for="tableName">{{
            tableName
          }}</label>
        </div>
      </RouterLink>
    </li>
  </ul>
</template>

<script lang="ts">
import { ref, inject, computed, toRef } from "vue";

export default {
  props: {
    activeTableName: String,
  },
  setup(props: any) {
    const store: any = inject("store");

    const search = ref("");
    const activeTableName = toRef(props, "activeTableName");

    const tableNames = computed(() =>
      store.table.state.TableNames.filter((tableName: string) =>
        tableName.toLowerCase().includes(search.value.toLowerCase())
      )
    );

    return { activeTableName, tableNames, search, store };
  },
};
</script>
