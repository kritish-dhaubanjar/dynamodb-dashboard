<template>
  <div class="dropdown">
    <input
      type="text"
      autocomplete="off"
      class="form-control rounded-0 mb-2"
      :placeholder="placeholder"
      :value="modelValue"
      @input="handleInput"
      @focus="handleFocus"
      :id="id"
    />
    <ul
      class="dropdown-menu rounded-0 w-100"
      :class="{ show: isOpen && (filteredItems.length > 0 || showNoItemsFound) }"
      :style="{ display: isOpen && (filteredItems.length > 0 || showNoItemsFound) ? 'block' : 'none' }"
    >
      <li
        v-for="item in filteredItems"
        v-bind:key="item"
      >
        <a
          class="dropdown-item"
          :class="{ active: item === modelValue }"
          @click.prevent="selectItem(item)"
        >
          {{ item }}
        </a>
      </li>
      <li v-if="showNoItemsFound && !filteredItems.length">
        <span class="dropdown-item text-muted">No matches found</span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, watch } from "vue";

  interface Props {
    modelValue: string;
    items: string[];
    placeholder?: string;
    id?: string;
    showNoItemsFound?: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    placeholder: "Search...",
    id: "search-dropdown",
    showNoItemsFound: false,
  });

  const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "select", value: string): void;
  }>();

  const isOpen = ref(false);
  const searchQuery = ref("");

  const filteredItems = computed(() => {
    if (!searchQuery.value) return props.items;
    return props.items.filter((item) => item.toLowerCase().includes(searchQuery.value.toLowerCase()));
  });

  // Watch for changes in filtered items to close dropdown if empty
  watch(filteredItems, (newItems) => {
    if (newItems.length === 0 && !props.showNoItemsFound) {
      isOpen.value = false;
    }
  });

  const handleInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    searchQuery.value = input.value;
    emit("update:modelValue", input.value);
    isOpen.value = true;
  };

  const handleFocus = () => {
    if (props.items.length > 0 || props.showNoItemsFound) {
      isOpen.value = true;
    }
  };

  const selectItem = (item: string) => {
    searchQuery.value = item;
    emit("update:modelValue", item);
    emit("select", item);
    isOpen.value = false;
  };

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest(".dropdown")) {
      isOpen.value = false;
    }
  };

  onMounted(() => {
    document.addEventListener("click", handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
  });
</script>

<style lang="scss" scoped>
  .dropdown-menu {
    z-index: 1028 !important;
    max-height: 200px;
    overflow-y: auto;
  }

  .dropdown-item {
    cursor: pointer;
    &:hover {
      background-color: #f8f9fa;
    }
    &.active {
      background-color: #e7f1ff;
      color: #0d6efd;
      &:hover {
        background-color: #d4e5ff;
      }
    }
  }
</style>
