<template>
  <div
    class="alert alert-primary rounded-0 mx-3 d-flex align-items-center justify-content-between"
    role="alert"
  >
    <p class="mb-0">
      This table has more items to retrieve. To retrieve the next page of items,
      choose Retrieve next page.
    </p>

    <div>
      <button
        type="button"
        :disabled="props.disabled"
        class="btn btn-outline-secondary btn-sm rounded-0 ms-3"
        @click.prevent="emit('next')"
      >
        Retrieve next page
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";

const emit = defineEmits(["next"]);

const props = defineProps({
  disabled: Boolean,
});
</script>
