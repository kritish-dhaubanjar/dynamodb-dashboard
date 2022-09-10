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
              :checked="selectedItems.length > 0"
              @change="toggle"
              :indeterminate="
                selectedItems.length > 0 && selectedItems.length < items.length
              "
            />
          </th>
          <th v-for="key in headers" scope="col" :key="key">
            {{ key }}
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
              <RouterLink
                :to="handleItem(item)"
                class="card-link text-decoration-none"
              >
                {{ item[key] }}
              </RouterLink>
            </div>
            <div v-else @click="emit('set', [item])">{{ item[key] }}</div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, ref } from "vue";

const store: any = inject("store");
const emit = defineEmits(["set"]);

const selectedItems = ref([]);

const headers = computed(() => store.ui.state.table.headers ?? []);
const items = computed(() => {
  selectedItems.value = [];

  const { Limit } = store.dynamodb.state;
  const { rows, page } = store.ui.state.table;

  return rows.slice((page - 1) * Limit, page * Limit);
});

const pk = computed(() =>
  store.table.state.Table.KeySchema.find(({ KeyType }) => KeyType === "HASH")
);
const sk = computed(() =>
  store.table.state.Table.KeySchema.find(({ KeyType }) => KeyType === "RANGE")
);

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
