<template>
  <div class="wrapper container-fluid py-4 px-5">
    <BreadCrumb />
    <br />
    <RouterView />
  </div>
</template>

<script async setup lang="ts">
  import store from "@/store";
  import { provide } from "vue";
  import BreadCrumb from "./components/common/bread-crumb.vue";

  provide("store", store);
</script>

<style scoped>
  .wrapper {
    background-color: #f2f3f3;
    min-height: 100vh;
  }
</style>
