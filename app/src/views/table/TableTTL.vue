<template>
  <div class="row">
    <div class="col-12 col-xl-11">
      <h3 class="mb-3">Time to Live (TTL) {{ route.params.tableName }}</h3>

      <div class="card rounded-0 border-0 shadow-sm">
        <div class="card-header py-3 border-0">
          <h4 class="mb-1">Time to Live (TTL)</h4>
          <small>Automatically delete expired items from a table.</small>
        </div>

        <div class="card-body border-0">
          <div class="row mb-4">
            <div class="col-12 mb-4">
              <div class="form-check form-switch">
                <input
                  class="form-check-input"
                  id="ttlStatus"
                  type="checkbox"
                  role="switch"
                  :checked="ttl.TimeToLiveSpecification.Enabled"
                  v-model="ttl.TimeToLiveSpecification.Enabled"
                />
                <label
                  class="form-check-label"
                  for="ttlStatus"
                >
                  TTL Status
                </label>
              </div>
            </div>

            <div class="col-lg-6 col-xl-4 mb-2">
              <label class="form-label">
                TTL attribute name
                <br />
                <div class="form-text">The name of the attribute that will be stored in the TTL timestamp.</div>
              </label>

              <input
                type="text"
                class="form-control rounded-0"
                placeholder="Enter attribute name"
                v-model="ttl.TimeToLiveSpecification.AttributeName"
                :disabled="!ttl.TimeToLiveSpecification.Enabled"
              />
              <div class="form-text">Between 1 and 255 characters.</div>
            </div>
          </div>
        </div>
      </div>

      <br />

      <div class="d-flex justify-content-end">
        <button
          type="button"
          class="btn btn-secondary rounded-0 me-2"
          @click="cancel"
        >
          Cancel
        </button>

        <button
          class="btn btn-primary rounded-0"
          type="button"
          @click="update"
        >
          <span
            class="spinner-grow spinner-grow-sm me-1"
            role="status"
            aria-hidden="true"
            v-if="store.ui.state.isLoading"
          ></span>
          <span class="visually-hidden">Loading...</span>
          Turn {{ ttl.TimeToLiveSpecification.Enabled ? "on" : "off" }} TTL
        </button>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast-container position-fixed top-0 start-50 translate-middle-x p-3">
      <div
        class="toast align-items-center border-0"
        :class="toast.className"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        ref="toastRef"
      >
        <div class="d-flex">
          <div class="toast-body">{{ toast.message }}</div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import * as bootstrap from "bootstrap";
  import { TTL } from "@/constants/dynamodb";
  import { useRoute, useRouter } from "vue-router";
  import { getTableTTL, updateTableTTL } from "@/services/table";
  import { inject, onBeforeMount, reactive, ref } from "vue";

  const route = useRoute();
  const router = useRouter();
  const store = inject("store") as any;

  const ttl = reactive({
    TimeToLiveSpecification: {
      Enabled: false,
      AttributeName: "",
    },
  });

  onBeforeMount(async () => {
    try {
      const data = await getTableTTL(route.params.tableName.toString());

      ttl.TimeToLiveSpecification.Enabled = data.TimeToLiveStatus === TTL.STATUS.ENABLED;
      ttl.TimeToLiveSpecification.AttributeName = data.AttributeName || "";
    } catch (error) {
      window.location.href = "/";
    }
  });

  const cancel = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push({ name: "home" });
    }
  };

  const toastRef = ref();
  const toast = reactive({ className: "", message: "" });

  const update = async () => {
    try {
      const data = await updateTableTTL(route.params.tableName, ttl);

      ttl.TimeToLiveSpecification.Enabled = data.TimeToLiveStatus === TTL.STATUS.ENABLED;
      ttl.TimeToLiveSpecification.AttributeName = data.AttributeName || "";

      toast.className = "text-bg-success";
      toast.message = "The table TTL has been updated successfully.";
    } catch (error) {
      toast.className = "text-bg-danger";
      toast.message = error.response?.data?.message ?? error.message;
    } finally {
      const toastEl = new bootstrap.Toast(toastRef.value, { delay: 1000 });
      setTimeout(() => toastEl.show(), 0);
    }
  };
</script>
