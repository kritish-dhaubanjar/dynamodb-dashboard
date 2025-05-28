<template>
  <div class="px-4 mt-4 d-flex justify-content-between">
    <h5 class="mb-0">
      Items returned
      <span class="text-muted">({{ rows.length }})</span>

      <div
        class="spinner-border spinner-border-sm ms-3"
        role="status"
        v-if="store.ui.state.isLoading"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </h5>

    <div class="d-flex">
      <div class="dropdown ms-3">
        <button
          class="btn btn-outline-primary btn-sm rounded-0"
          type="button"
          @click="reload"
        >
          <i class="bi bi-arrow-clockwise"></i>
        </button>

        <button
          class="ms-3 btn btn-outline-primary dropdown-toggle btn-sm rounded-0"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          Actions
        </button>
        <ul class="dropdown-menu rounded-0">
          <li>
            <a
              href="#"
              class="dropdown-item"
              @click.prevent="emit('action', 'EDIT')"
            >
              Edit Items
            </a>
            <a
              href="#"
              class="dropdown-item"
              @click.prevent="emit('action', 'DELETE')"
            >
              Delete Items
            </a>
            <a
              href="#"
              class="dropdown-item"
              @click.prevent="startDownload"
            >
              Download as JSON
            </a>
          </li>
        </ul>
      </div>

      <RouterLink
        v-if="tableName"
        :to="{
          name: 'create-item',
          params: { tableName },
        }"
      >
        <button
          type="button"
          class="ms-2 btn btn-outline-primary btn-sm rounded-0"
        >
          Create Item
        </button>
      </RouterLink>
    </div>
  </div>

  <!-- Download Progress Toast -->
  <div
    class="toast-container position-fixed bottom-0 end-0 p-3"
    style="z-index: 1500"
  >
    <div
      id="downloadToast"
      class="toast"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      ref="downloadToastRef"
    >
      <div class="toast-header">
        <strong class="me-auto">
          <i
            v-if="isComplete"
            class="bi bi-check-circle-fill text-success me-2"
          ></i>
          {{ isComplete ? "Download Complete" : "Downloading Data" }}
        </strong>
        <small>{{ downloadCount }} {{ downloadCount === 1 ? "item" : "items" }}</small>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
        ></button>
      </div>
      <div class="toast-body">
        <div class="d-flex align-items-center">
          <div class="flex-grow-1 me-3">
            <div
              class="progress"
              style="height: 5px"
            >
              <div
                class="progress-bar"
                :class="{
                  'progress-bar-striped progress-bar-animated': !isComplete,
                  'bg-success': isComplete,
                }"
                role="progressbar"
                :style="{ width: downloadProgress + '%' }"
                :aria-valuenow="downloadProgress"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
          <small class="text-muted">{{ downloadProgress }}%</small>
        </div>
        <div class="mt-2 text-muted small">
          <span v-if="downloadSize">File size: {{ downloadSize }}</span>
          <span v-else>Preparing download...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, inject, ref, onMounted } from "vue";
  import { useRoute } from "vue-router";
  import * as bootstrap from "bootstrap";

  const store: any = inject("store");
  const emit = defineEmits(["action"]);
  const route = useRoute();

  const rows = computed(() => store.ui.state.table.rows);
  const selectedRows = computed(() => store.ui.state.table.selectedRows);
  const downloadToastRef = ref<HTMLElement | null>(null);
  const downloadToast = ref<bootstrap.Toast | null>(null);
  const isDownloading = ref(false);
  const downloadProgress = ref(0);
  const downloadSize = ref("");
  const isComplete = ref(false);

  const reload = () => window.location.reload();

  const tableName = computed(() => {
    return store.table?.Table?.TableName || route.query.tableName?.toString();
  });

  const downloadCount = computed(() => {
    return selectedRows.value > 0 ? selectedRows.value : rows.value.length;
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  onMounted(() => {
    if (downloadToastRef.value) {
      downloadToast.value = new bootstrap.Toast(downloadToastRef.value, {
        autohide: false,
      });
    }
  });

  const startDownload = async () => {
    isDownloading.value = true;
    downloadProgress.value = 0;
    isComplete.value = false;
    downloadToast.value?.show();

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      if (downloadProgress.value < 90) {
        downloadProgress.value += 10;
      }
    }, 100);

    try {
      // If there are selected rows, use them; otherwise use all rows
      const dataToDownload =
        selectedRows.value > 0 ? rows.value.filter((_: any, index: number) => index < selectedRows.value) : rows.value;

      const dataStr = JSON.stringify(dataToDownload, null, 2);
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
      const exportFileDefaultName = `${tableName.value}_data.json`;

      // Calculate and display file size
      const blob = new Blob([dataStr], { type: "application/json" });
      downloadSize.value = formatFileSize(blob.size);

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);

      // Complete the progress
      downloadProgress.value = 100;
      isComplete.value = true;
      clearInterval(progressInterval);

      // Keep toast visible for 3 seconds after completion
      setTimeout(() => {
        linkElement.click();
        setTimeout(() => {
          downloadToast.value?.hide();
          isDownloading.value = false;
          downloadProgress.value = 0;
          downloadSize.value = "";
          isComplete.value = false;
        }, 3000);
      }, 500);
    } catch (error) {
      console.error("Download failed:", error);
      clearInterval(progressInterval);
      isDownloading.value = false;
      downloadProgress.value = 0;
      downloadSize.value = "";
      isComplete.value = false;
      downloadToast.value?.hide();
      // You might want to show an error toast here
    }
  };
</script>

<style scoped>
  .toast {
    min-width: 300px;
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }

  .toast-header {
    background-color: rgba(255, 255, 255, 0.95);
  }

  .progress {
    height: 5px;
    border-radius: 0;
    background-color: rgba(0, 0, 0, 0.1);
  }

  .progress-bar {
    background-color: var(--bs-primary);
  }

  .progress-bar.bg-success {
    background-color: var(--bs-success) !important;
  }
</style>
