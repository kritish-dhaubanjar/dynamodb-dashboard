<template>
  <ul class="list-group rounded-0 shadow-sm">
    <li class="list-group-item py-3">
      <h5 class="mb-3">
        Tables
        <span class="text-muted">({{ tableNames.length }})</span>
      </h5>
      <div class="input-group mb-3 flex-row-reverse">
        <input
          type="text"
          v-model="search"
          class="form-control rounded-0 border-start-0"
          placeholder="Find tables by table name"
        />
        <span class="input-group-text bg-white rounded-0 border-end-0 pe-0"><i class="bi bi-search"></i></span>
      </div>
    </li>

    <router-link
      custom
      v-slot="{ navigate }"
      v-for="tableName in tableNames"
      :key="tableName"
      :to="{
        name: 'home',
        query: {
          limit: store.dynamodb.state.Limit,
          tableName,
          page: 1,
          operation: 'SCAN',
          indexName: tableName,
        },
      }"
    >
      <li
        class="list-group-item py-2"
        @click="navigate"
      >
        <div class="form-check">
          <input
            class="form-check-input"
            name="table"
            type="radio"
            :value="tableName"
            :id="tableName"
            :checked="tableName === (activeTableName ?? store.table.state.Table.TableName)"
          />
          <label
            class="form-check-label ps-3 text-break"
            :for="tableName"
          >
            {{ tableName }}
          </label>
        </div>
      </li>
    </router-link>
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
          tableName.toLowerCase().includes(search.value.toLowerCase()),
        ),
      );

      // TODO: fix this
      // eslint-disable-next-line vue/no-dupe-keys
      return { activeTableName, tableNames, search, store };
    },
  };
</script>

<style lang="scss">
  label,
  li {
    cursor: pointer;
    color: var(--bs-link-hover-color);
  }

  input:focus + span {
    border-color: #86b7fe;
  }
</style>
