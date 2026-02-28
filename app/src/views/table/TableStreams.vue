<template>
  <div class="row">
    <div class="col-12 col-xl-11">
      <h3 class="mb-3">DynamoDB stream details {{ route.params.tableName }}</h3>

      <div class="card rounded-0 border-0 shadow-sm">
        <div class="card-header py-3 border-0">
          <h4 class="mb-1">DynamoDB stream details</h4>
          <small>
            Capture item-level changes in your table, and push the changes to a DynamoDB stream. You then can access the
            change information through the DynamoDB Streams API.
          </small>
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
                  :checked="stream.StreamSpecification.StreamEnabled"
                  v-model="stream.StreamSpecification.StreamEnabled"
                />
                <label
                  class="form-check-label"
                  for="ttlStatus"
                >
                  DynamoDB Stream
                </label>
              </div>
            </div>

            <div class="col-lg-12 mb-2">
              <label class="form-label">
                View type
                <br />
                <div class="form-text">
                  Choose which versions of the changed items you would like to push to the DynamoDB stream.
                </div>
              </label>

              <div class="form-check mb-2">
                <input
                  :disabled="!stream.StreamSpecification.StreamEnabled"
                  v-model="stream.StreamSpecification.StreamViewType"
                  class="form-check-input"
                  type="radio"
                  name="StreamViewType"
                  id="NEW_AND_OLD_IMAGES"
                  value="NEW_AND_OLD_IMAGES"
                />

                <label
                  class="form-check-label"
                  for="NEW_AND_OLD_IMAGES"
                >
                  New and old images
                  <br />
                  <div class="form-text">Both the new and old images of the changed item.</div>
                </label>
              </div>

              <div class="form-check mb-2">
                <input
                  :disabled="!stream.StreamSpecification.StreamEnabled"
                  v-model="stream.StreamSpecification.StreamViewType"
                  class="form-check-input"
                  type="radio"
                  name="StreamViewType"
                  id="KEYS_ONLY"
                  value="KEYS_ONLY"
                />

                <label
                  class="form-check-label"
                  for="KEYS_ONLY"
                >
                  Key attributes only
                  <br />
                  <div class="form-text">Only the key attributes of the changed item.</div>
                </label>
              </div>

              <div class="form-check mb-2">
                <input
                  :disabled="!stream.StreamSpecification.StreamEnabled"
                  v-model="stream.StreamSpecification.StreamViewType"
                  class="form-check-input"
                  type="radio"
                  name="StreamViewType"
                  id="NEW_IMAGE"
                  value="NEW_IMAGE"
                />

                <label
                  class="form-check-label"
                  for="NEW_IMAGE"
                >
                  New image
                  <br />
                  <div class="form-text">The entire item as it appears after it was changed.</div>
                </label>
              </div>

              <div class="form-check mb-2">
                <input
                  :disabled="!stream.StreamSpecification.StreamEnabled"
                  v-model="stream.StreamSpecification.StreamViewType"
                  class="form-check-input"
                  type="radio"
                  name="StreamViewType"
                  id="OLD_IMAGE"
                  value="OLD_IMAGE"
                />

                <label
                  class="form-check-label"
                  for="OLD_IMAGE"
                >
                  Old image
                  <br />
                  <div class="form-text">The entire item as it appears before it was changed.</div>
                </label>
              </div>
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
          Turn {{ stream.StreamSpecification.StreamEnabled ? "on" : "off" }} stream
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
  import { cloneDeep } from "lodash";
  import * as bootstrap from "bootstrap";
  import { TTL } from "@/constants/dynamodb";
  import { useRoute, useRouter } from "vue-router";
  import { updateTableStream, getTable } from "@/services/table";
  import { computed, inject, onBeforeMount, reactive, ref } from "vue";

  const route = useRoute();
  const router = useRouter();
  const store: any = inject("store");

  const stream = reactive({
    StreamSpecification: {
      StreamEnabled: false,
      StreamViewType: "NEW_AND_OLD_IMAGES",
    },
  });

  onBeforeMount(async () => {
    try {
      const data = await getTable(route.params.tableName.toString());

      stream.StreamSpecification.StreamEnabled = Boolean(data.StreamSpecification?.StreamEnabled);
      stream.StreamSpecification.StreamViewType = data.StreamSpecification?.StreamViewType ?? "NEW_AND_OLD_IMAGES";
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

  const reset = () => {};

  const toastRef = ref();
  const toast = reactive({ className: "", message: "" });

  const update = async () => {
    try {
      const body = cloneDeep(stream);

      if (!stream.StreamSpecification.StreamEnabled) {
        delete body.StreamSpecification.StreamViewType;
      }

      const data = await updateTableStream(route.params.tableName, body);

      toast.className = "text-bg-success";
      toast.message = "The table stream has been updated successfully.";
    } catch (error) {
      toast.className = "text-bg-danger";
      toast.message = error.response?.data?.message ?? error.message;
    } finally {
      const toastEl = new bootstrap.Toast(toastRef.value, { delay: 1000 });
      setTimeout(() => toastEl.show(), 0);
    }
  };
</script>
