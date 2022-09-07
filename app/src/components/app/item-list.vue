<template>
  <div class="table-responsive mx-3">
    <table class="table table-hover table-bordered">
      <thead>
        <tr>
          <th scope="col">
            <input
              class="form-check-input mt-1"
              type="checkbox"
              value=""
              aria-label="Checkbox for following text input"
            />
          </th>
          <th v-for="key in headers" scope="col" :key="key">
            {{ key }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item[headers[0]]">
          <td>
            <input
              class="form-check-input mt-1"
              type="checkbox"
              value=""
              aria-label="Checkbox for following text input"
            />
          </td>
          <td v-for="(key, index) in headers" :key="key">
            <div v-if="index === 0">
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
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const store: any = inject("store");

const headers = computed(() => store.ui.state.table.headers ?? []);
const items = computed(() => {
  const { Limit } = store.dynamodb.state;
  const { rows, page } = store.ui.state.table;

  return rows.slice((page - 1) * Limit, page * Limit);
});

const handleItem = (item: object) => {
  const table = store.table.state.Table;
  const tableName = table.TableName;

  const pk = table.KeySchema.find(({ KeyType }) => KeyType === "HASH");
  const sk = table.KeySchema.find(({ KeyType }) => KeyType === "RANGE");

  return {
    name: "edit-item",
    params: { tableName },
    query: {
      ...(pk && { pk: item[pk.AttributeName] }),
      ...(sk && { sk: item[sk.AttributeName] }),
    },
  };
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
</style>
