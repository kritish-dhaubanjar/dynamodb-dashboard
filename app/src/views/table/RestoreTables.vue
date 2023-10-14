<template>
  <div class="row">
    <div class="col-12 col-xl-11">
      <h3 class="mb-3">Restore tables</h3>

      <div class="row">
        <div class="col-xl-4 mb-4">
          <form @submit.prevent="explore">
            <div class="card rounded-0 border-0 shadow-sm">
              <div class="card-header py-3 border-0">
                <h4 class="mb-1">Command line or programmatic access</h4>
                <small>Temporary credentials of an IAM role for CLI or programmatic access to an AWS account.</small>
              </div>
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
                      <input
                        required
                        type="text"
                        class="form-control rounded-0"
                        placeholder="eg: https://dynamodb.us-west-2.amazonaws.com"
                        v-model="credentials.AWS_ENDPOINT"
                      />
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

                  <div class="d-flex justify-content-end mt-5 pt-5">
                    <button
                      type="button"
                      class="btn btn-secondary rounded-0 me-2"
                      @click="cancel"
                    >
                      Cancel
                    </button>

                    <button
                      class="btn btn-primary rounded-0"
                      type="submit"
                    >
                      <span
                        class="spinner-grow spinner-grow-sm me-1"
                        role="status"
                        aria-hidden="true"
                        v-if="store.ui.state.isLoading"
                      ></span>
                      <span class="visually-hidden">Loading...</span>
                      Explore Tables
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="col-xl-7">
          <div class="card rounded-0 border-0 shadow-sm">
            <div class="card-header py-3 border-0">
              <h4 class="mb-1">Tables</h4>
              <small>
                These changes are destructive. This means that the table schemas and all data in the tables will be
                deleted and refreshed from the source table.
              </small>
            </div>
            <div class="card-body border-0 table-list">
              <div class="mb-3">
                <div class="row">
                  <div class="col-6">
                    <ul class="list-group rounded-0">
                      <li class="list-group-item pt-3">
                        <div class="input-group mb-3 flex-row-reverse">
                          <input
                            type="text"
                            class="form-control rounded-0 border-start-0"
                            placeholder="Find tables by table name"
                            v-model="remoteTableSearch"
                          />
                          <span class="input-group-text bg-white rounded-0 border-end-0 pe-0">
                            <i class="bi bi-search"></i>
                          </span>
                        </div>
                      </li>

                      <li class="table-container overflow-scroll list-group-item p-0">
                        <table class="table table-bordered mb-0">
                          <thead class="sticky-top bg-light shadow-sm">
                            <tr class="border-top-0">
                              <th
                                scope="col"
                                class="checkbox-container border-start-0"
                              >
                                <input
                                  class="form-check-input mt-1"
                                  type="checkbox"
                                  value=""
                                  :checked="localTables.length > 0"
                                  :indeterminate="localTables.length > 0 && localTables.length < remoteTables.length"
                                  @change="localTables = localTables.length ? [] : remoteTables"
                                />
                              </th>
                              <th
                                scope="col"
                                class="border-end-0"
                              >
                                Export Tables
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              @click="toggle(table)"
                              v-for="table in remoteTables.filter((t) =>
                                t.toLowerCase().includes(remoteTableSearch.toLowerCase()),
                              )"
                              :key="table"
                            >
                              <th
                                scope="row"
                                class="border-start-0"
                              >
                                <input
                                  class="form-check-input mt-1"
                                  type="checkbox"
                                  :checked="localTables.includes(table)"
                                />
                              </th>
                              <td class="border-end-0">{{ table }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </li>
                    </ul>
                  </div>

                  <div class="col-6">
                    <ul class="list-group rounded-0">
                      <li class="list-group-item pt-3">
                        <div class="input-group mb-3 flex-row-reverse">
                          <input
                            type="text"
                            class="form-control rounded-0 border-start-0"
                            placeholder="Find tables by table name"
                            v-model="localTableSearch"
                          />
                          <span class="input-group-text bg-white rounded-0 border-end-0 pe-0">
                            <i class="bi bi-search"></i>
                          </span>
                        </div>
                      </li>

                      <li class="table-container overflow-scroll list-group-item p-0">
                        <table class="table table-bordered mb-0">
                          <thead class="sticky-top bg-light shadow-sm">
                            <tr class="border-top-0">
                              <th
                                scope="col"
                                class="checkbox-container border-start-0"
                              >
                                <input
                                  class="form-check-input mt-1"
                                  type="checkbox"
                                  value=""
                                  :checked="localTables.length > 0"
                                  @change="localTables = []"
                                />
                              </th>
                              <th
                                scope="col"
                                class="border-end-0"
                              >
                                Import Tables
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              @click="toggle(table)"
                              v-for="table in localTables.filter((t) =>
                                t.toLowerCase().includes(localTableSearch.toLowerCase()),
                              )"
                              :key="table"
                            >
                              <th
                                scope="row"
                                class="border-start-0"
                              >
                                <input
                                  class="form-check-input mt-1"
                                  type="checkbox"
                                  checked
                                />
                              </th>
                              <td class="border-end-0">
                                {{ table }}
                                <div
                                  v-if="
                                    progress.queue.includes(table) &&
                                    ![...progress.done, ...progress.failed].includes(table)
                                  "
                                  class="spinner-border spinner-border-sm float-end"
                                  role="status"
                                >
                                  <span class="visually-hidden">Loading...</span>
                                </div>

                                <i
                                  class="bi bi-check-circle float-end text-success"
                                  v-if="progress.done.includes(table)"
                                ></i>
                                <i
                                  class="bi bi-exclamation-circle float-end text-danger"
                                  v-if="progress.failed.includes(table)"
                                ></i>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </li>
                    </ul>
                  </div>
                </div>

                <br />
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
                    class="btn btn-danger rounded-0"
                    type="button"
                    @click="restore"
                  >
                    <span
                      class="spinner-grow spinner-grow-sm me-1"
                      role="status"
                      aria-hidden="true"
                      v-if="store.ui.state.isLoading"
                    ></span>
                    <span class="visually-hidden">Loading...</span>
                    Restore Tables
                  </button>
                </div>
              </div>
            </div>
          </div>
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
  </div>
</template>

<script lang="ts" setup>
  import axios from "axios";
  import * as bootstrap from "bootstrap";
  import { useRouter } from "vue-router";
  import ROUTES from "@/constants/routes";
  import { AWS_REGIONS } from "@/constants/dynamodb";
  import { computed, inject, reactive, ref } from "vue";
  import { generateString, interpolate } from "@/utils/string";
  import { getRemoteTables, restoreTables } from "@/services/table";

  const store: any = inject("store");

  const remoteTableSearch = ref("");
  const localTableSearch = ref("");
  const remoteTables = ref([]);
  const localTables = ref([]);

  const progress = reactive({
    queue: [],
    done: [],
    failed: [],
  });

  const credentials = reactive({
    AWS_REGION: "",
    AWS_ENDPOINT: "",
    AWS_ACCESS_KEY_ID: "",
    AWS_SESSION_TOKEN: "",
    AWS_SECRET_ACCESS_KEY: "",
  });

  const router = useRouter();

  const toastRef = ref();
  const toast = reactive({
    className: "",
    message: "",
  });

  const explore = async () => {
    progress.done = [];
    progress.queue = [];
    progress.failed = [];

    try {
      remoteTables.value = await getRemoteTables({ credentials });
      localTables.value = [];
    } catch (error) {
      toast.className = "text-bg-danger";
      toast.message = error.response?.data?.message ?? error.message;
      const toastEl = new bootstrap.Toast(toastRef.value, { delay: 1000 });
      setTimeout(() => toastEl.show(), 0);
    }
  };

  const sseOnMessageHandler = (sse, { data }) => {
    const { event, tableName, error } = JSON.parse(data);

    if (event === "END") {
      return sse.close();
    }

    if (error) {
      progress.failed.push(tableName);
      progress.queue = progress.queue.filter((e) => e !== tableName);

      toast.className = "text-bg-danger";
      toast.message = error.response?.data?.message ?? error.message;
      const toastEl = new bootstrap.Toast(toastRef.value, { delay: 1000 });
      setTimeout(() => toastEl.show(), 0);
    } else {
      progress.done.push(tableName);
      progress.queue = progress.queue.filter((e) => e !== tableName);
    }
  };

  const restore = async () => {
    progress.failed = [];
    progress.done = [];
    progress.queue = localTables.value;

    const uid = generateString(32);
    const eventSourceURL = interpolate(`${axios.defaults.baseURL}${ROUTES.DATABASE.STREAM}`, { uid });

    const sse = new EventSource(eventSourceURL);
    sse.onmessage = (payload) => sseOnMessageHandler(sse, payload);

    try {
      await restoreTables(uid, { credentials, tableNames: localTables.value });
    } catch (error) {
      toast.className = "text-bg-danger";
      toast.message = error.response?.data?.message ?? error.message;
      const toastEl = new bootstrap.Toast(toastRef.value, { delay: 1000 });
      setTimeout(() => toastEl.show(), 0);
    } finally {
      progress.queue = [];
    }
  };

  const toggle = (table) => {
    const shouldRestore = localTables.value.includes(table);
    localTables.value = shouldRestore ? localTables.value.filter((t) => t !== table) : [...localTables.value, table];
  };

  const cancel = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push({ name: "home" });
    }
  };

  const handleOnClick = (e) => {
    const dropdownElement = document.getElementById(e.target.id);
    const dropdown = new bootstrap.Dropdown(dropdownElement);
    dropdown.show();
  };

  const filteredAWSRegions = computed(
    () => (q: string) => AWS_REGIONS.filter((region: string) => region?.includes(q)) || AWS_REGIONS || [],
  );
</script>

<style scoped>
  .table-list {
    min-height: 523px;
    max-height: 523px;
  }

  .table-container {
    min-height: 335px;
    max-height: 335px;
    overflow-x: hidden !important;
  }

  .checkbox-container {
    width: 36px;
  }
</style>
