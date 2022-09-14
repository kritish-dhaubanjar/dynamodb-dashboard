<template>
  <div class="row">
    <div class="col-12">
      <nav style="--bs-breadcrumb-divider: '>'" aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="/">DynamoDB</a></li>
          <li class="breadcrumb-item">
            <a href="#" @click.prevent="cancel">{{ route.meta.name }}</a>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {{ store.table.state.Table.TableName }}
          </li>
        </ol>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const store: any = inject("store");

const cancel = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: "home" });
  }
};
</script>
