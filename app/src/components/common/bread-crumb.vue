<template>
  <div class="row">
    <div class="col-12">
      <nav
        style="--bs-breadcrumb-divider: &quot;>&quot;"
        aria-label="breadcrumb"
        class="d-flex justify-content-between"
      >
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="/">DynamoDB</a></li>
          <li class="breadcrumb-item">
            <a
              href="#"
              @click.prevent="cancel"
            >
              {{ route.meta.name }}
            </a>
          </li>
          <li
            class="breadcrumb-item active"
            aria-current="page"
          >
            {{ store.table.state.Table.TableName }}
          </li>
        </ol>
        <div class="d-flex">
          <i
            class="bi bi-gear me-3"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#settings"
          ></i>

          <i
            class="bi bi-bootstrap-reboot me-2"
            type="button"
            @click.prevent="disconnect"
          ></i>

          <i class="bi bi-sun me-1"></i>
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              role="switch"
              @change="(e) => toggleDarkReader(e.target.checked)"
              :checked="initIsDarkReaderEnabled"
            />
            <i class="bi bi-moon"></i>
          </div>
        </div>
      </nav>
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

    <!-- Modal -->
    <div
      class="modal fade"
      id="settings"
      tabindex="-1"
      aria-hidden="true"
    >
      <form
        class="modal-dialog"
        @submit.prevent="connect"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h1
              class="modal-title fs-5"
              id="exampleModalLabel"
            >
              Settings
            </h1>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="card-body border-0">
              <div class="mb-3">
                <div class="row mb-3">
                  <div>
                    <label class="form-label">
                      AWS Region *
                      <br />
                    </label>

                    <div class="dropdown">
                      <input
                        required
                        type="text"
                        class="form-control rounded-0"
                        placeholder="eg: us-west-2"
                        v-model="credentials.AWS_REGION"
                        data-bs-toggle="dropdown"
                        @click="handleOnClick"
                        @keyup="handleOnClick"
                        id="dropdown-input-toggle-aws-region"
                      />

                      <ul
                        class="dropdown-menu rounded-0"
                        :class="{ 'p-0 border-0': !filteredAWSRegions(credentials.AWS_REGION).length }"
                      >
                        <li
                          v-for="region in filteredAWSRegions(credentials.AWS_REGION)"
                          v-bind:key="region"
                        >
                          <a
                            class="dropdown-item"
                            @click.prevent="credentials.AWS_REGION = region"
                          >
                            {{ region }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="row mb-3">
                  <div>
                    <label class="form-label">
                      AWS DynamoDB Endpoint *
                      <br />
                    </label>

                    <div class="dropdown">
                      <input
                        required
                        type="text"
                        class="form-control rounded-0"
                        placeholder="eg: https://dynamodb.us-west-2.amazonaws.com"
                        v-model="credentials.AWS_ENDPOINT"
                        data-bs-toggle="dropdown"
                        @click="handleOnClick"
                        @keyup="handleOnClick"
                        id="dropdown-input-toggle-aws-dynamodb"
                      />

                      <ul
                        class="dropdown-menu rounded-0"
                        :class="{
                          'p-0 border-0': !filteredAWSDynamoDBEndpoints(credentials.AWS_ENDPOINT).length,
                        }"
                      >
                        <li
                          v-for="endpoint in filteredAWSDynamoDBEndpoints(credentials.AWS_ENDPOINT)"
                          v-bind:key="endpoint"
                        >
                          <a
                            class="dropdown-item"
                            @click.prevent="credentials.AWS_ENDPOINT = endpoint"
                          >
                            {{ endpoint }}
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div class="row mb-3">
                  <div>
                    <label class="form-label">
                      AWS Access Key Id *
                      <br />
                    </label>
                    <input
                      required
                      type="text"
                      class="form-control rounded-0"
                      placeholder="eg: AKIAIOSFODNN7EXAMPLE"
                      v-model="credentials.AWS_ACCESS_KEY_ID"
                    />
                  </div>
                </div>

                <div class="row mb-3">
                  <div>
                    <label class="form-label">
                      AWS Secret access key *
                      <br />
                    </label>
                    <input
                      required
                      type="text"
                      class="form-control rounded-0"
                      placeholder="eg: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                      v-model="credentials.AWS_SECRET_ACCESS_KEY"
                    />
                  </div>
                </div>

                <div class="row mb-3">
                  <div>
                    <label class="form-label">
                      AWS session token
                      <br />
                    </label>
                    <input
                      type="text"
                      class="form-control rounded-0"
                      placeholder="eg: FQoGZXIvYXdzENv//////////wEaDEeLj11xTbnBk6azRCKsAacCiJK85DSXExJ81GtHrkEyev8eedQcFY4EoM00PsD1FAEMOfzQclVEFsoh9Y4ZHUjgGmCPRUnYCLNc2NnHkadvmI+MT7jRRa1Mo2HA/HYStOOwEyfXFYG91MNj9rVXXXXXXXXA6+7FF6jcxj3cr1U9CDB9hjW+jGq4UgjxXXXXXXXCoIidDjl4Z911zIzP/Q+FYA1R2CUz5Y32EUaMzR+bQvmheUolLOq3wU="
                      v-model="credentials.AWS_SESSION_TOKEN"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary rounded-0"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary rounded-0"
            >
              Connect
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  import * as bootstrap from "bootstrap";
  import { useRoute, useRouter } from "vue-router";
  import * as DatabaseService from "@/services/database";
  import { inject, onBeforeMount, ref, reactive, computed } from "vue";
  import { AWS_REGIONS, AWS_DYNAMODB_ENDPOINTS } from "@/constants/dynamodb";
  import { setFetchMethod, enable as enableDarkReader, disable as disableDarkMode } from "darkreader";

  const route = useRoute();
  const router = useRouter();
  const store: any = inject("store");
  const initIsDarkReaderEnabled = ref(false);

  const toastRef = ref();
  const toast = reactive({
    className: "",
    message: "",
  });

  const credentials = reactive({
    AWS_REGION: "",
    AWS_ENDPOINT: "",
    AWS_ACCESS_KEY_ID: "",
    AWS_SESSION_TOKEN: "",
    AWS_SECRET_ACCESS_KEY: "",
  });

  const handleOnClick = (e) => {
    const dropdownElement = document.getElementById(e.target.id);
    const dropdown = new bootstrap.Dropdown(dropdownElement);
    dropdown.show();
  };

  const filteredAWSRegions = computed(
    () => (q: string) => AWS_REGIONS.filter((region: string) => region?.includes(q)) || AWS_REGIONS || [],
  );

  const filteredAWSDynamoDBEndpoints = computed(
    () => (q: string) =>
      AWS_DYNAMODB_ENDPOINTS.filter((endpoint: string) => endpoint?.includes(q)) || AWS_DYNAMODB_ENDPOINTS || [],
  );

  const cancel = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push({ name: "home" });
    }
  };

  const connect = async () => {
    try {
      await DatabaseService.connect({ credentials });
      window.location.reload();
    } catch (error) {
      toast.className = "text-bg-danger";
      toast.message = error.response?.data?.message ?? error.message;
      const toastEl = new bootstrap.Toast(toastRef.value, { delay: 1000 });
      setTimeout(() => toastEl.show(), 0);
    }
  };

  const disconnect = async () => {
    try {
      await DatabaseService.disconnect();
      window.location.reload();
    } catch (error) {
      toast.className = "text-bg-danger";
      toast.message = error.response?.data?.message ?? error.message;
      const toastEl = new bootstrap.Toast(toastRef.value, { delay: 1000 });
      setTimeout(() => toastEl.show(), 0);
    }
  };

  onBeforeMount(() => {
    setFetchMethod(window.fetch);
    initIsDarkReaderEnabled.value = !!localStorage.getItem("darkreader");
    toggleDarkReader(initIsDarkReaderEnabled.value);
  });

  const toggleDarkReader = (value: boolean) => {
    if (value) {
      enableDarkReader({
        brightness: 90,
        contrast: 90,
      });
      localStorage.setItem("darkreader", value.toString());
    } else {
      disableDarkMode();
      localStorage.removeItem("darkreader");
    }
  };
</script>
