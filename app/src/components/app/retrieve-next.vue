<template>
  <div
    class="alert rounded-0 mx-3 d-flex align-items-center justify-content-between"
    :class="{
      'alert-info': store.ui.state.isLoading,
      'alert-warning': store.dynamodb.state.ExclusiveStartKey,
      'alert-success': !store.dynamodb.state.ExclusiveStartKey,
    }"
    role="alert"
  >
    <p class="mb-0">
      • Items returned:
      <strong>{{ store.ui.state.table.count }}</strong>
      • Items scanned:
      <strong>{{ store.ui.state.table.scannedCount }}</strong>
      • Efficiency:
      <strong>{{ Number((store.ui.state.table.count / store.ui.state.table.scannedCount) * 100).toFixed(2) }}</strong>
      %
    </p>

    <div v-if="store.dynamodb.state.ExclusiveStartKey">
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

  const store: any = inject("store");

  const props = defineProps({
    disabled: Boolean,
  });
</script>
