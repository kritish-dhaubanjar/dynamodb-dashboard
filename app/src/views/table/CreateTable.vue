<template>
  <div class="row">
    <div class="col-12 col-xl-11">
      <h3 class="mb-3">Create table</h3>

      <div class="card rounded-0 border-0 shadow-sm">
        <div class="card-header py-3 border-0">
          <h4 class="mb-1">Table details</h4>
          <small>
            DynamoDB is a schemaless database that requires only a table name and a primary key when you create the
            table.
          </small>
        </div>
        <div class="card-body border-0">
          <div class="mb-3">
            <div class="row">
              <div class="col-xl-4">
                <label class="form-label">
                  Table name
                  <br />
                  <small class="text-muted">This will be used to identify your table.</small>
                </label>
                <input
                  type="text"
                  class="form-control rounded-0"
                  placeholder="Enter name for table"
                  v-model="table.name"
                />
                <div class="form-text">
                  Between 3 and 255 characters, containing only letters, numbers, underscores (_), hyphens (-), and
                  periods (.).
                </div>
              </div>
            </div>

            <hr />

            <label class="form-label">
              Partition key
              <br />
              <small class="text-muted">
                The partition key is part of the table's primary key. It is a hash value that is used to retrieve items
                from your table and allocate data across hosts for scalability and availability.
              </small>
            </label>

            <div class="row mb-4">
              <div class="col-xl-3 mb-1">
                <input
                  type="text"
                  class="form-control rounded-0"
                  placeholder="Enter the partition key name"
                  v-model="table.keySchema.pk.name"
                />
                <div class="form-text">1 to 255 characters and case sensitive.</div>
              </div>
              <div class="col-xl-2 mb-1">
                <select
                  class="rounded-0 form-select"
                  v-model="table.keySchema.pk.type"
                >
                  <option value="S">String</option>
                  <option value="N">Number</option>
                  <option value="B">Binary</option>
                </select>
              </div>
            </div>

            <label class="form-label">
              Sort key - optional
              <br />
              <small class="text-muted">
                You can use a sort key as the second part of a table's primary key. The sort key allows you to sort or
                search among all items sharing the same partition key.
              </small>
            </label>

            <div class="row">
              <div class="col-xl-3 mb-1">
                <input
                  type="text"
                  class="form-control rounded-0"
                  placeholder="Enter the sort key name"
                  v-model="table.keySchema.sk.name"
                />
                <div class="form-text">1 to 255 characters and case sensitive.</div>
              </div>

              <div class="col-xl-2 mb-1">
                <select
                  class="rounded-0 form-select"
                  v-model="table.keySchema.sk.type"
                >
                  <option value="S">String</option>
                  <option value="N">Number</option>
                  <option value="B">Binary</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--  -->

      <br />
      <br />

      <div class="card rounded-0 border-0 shadow-sm">
        <div class="card-header py-3 border-0">
          <h4 class="mb-1">Read/write capacity settings</h4>
        </div>
        <div class="card-body border-0">
          <div class="mb-3">
            <div class="row">
              <div class="col-lg-3 mb-2">
                <label class="form-label">
                  Read capacity
                  <br />
                  <small class="text-muted">Provisioned capacity units</small>
                </label>
                <input
                  type="number"
                  min="1"
                  class="form-control rounded-0"
                  placeholder="Enter provisioned capacity"
                  v-model="table.throughput.read"
                />
              </div>
              <div class="col-lg-3">
                <label class="form-label">
                  Write capacity
                  <br />
                  <small class="text-muted">Provisioned capacity units</small>
                </label>
                <input
                  type="number"
                  min="1"
                  class="form-control rounded-0"
                  placeholder="Enter provisioned capacity"
                  v-model="table.throughput.write"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />

      <div class="card rounded-0 border-0 shadow-sm">
        <div class="card-header py-3 border-0">
          <h4 class="mb-1">Secondary indexes</h4>
          <small>
            Use secondary indexes to perform queries on attributes that are not part of your table's primary key.
          </small>
          <ul>
            <li>
              <small>
                A local secondary index has the same partition key as its base table, but it has a different sort key.
              </small>
            </li>
            <li>
              <small>
                Create global secondary indexes to query attributes outside the primary key of your original table.
              </small>
            </li>
          </ul>
        </div>
        <div class="card-body border-0">
          <div
            class="row mb-4"
            v-for="(index, i) in table.indices"
            :key="i"
          >
            <div class="col-lg-3 col-xl-1 mb-2">
              <label class="form-label">
                Index Type
                <br />
              </label>

              <select
                class="rounded-0 form-select"
                v-model="index.type"
              >
                <option value="GSI">GSI &nbsp; (Global Secondary Index)</option>
                <option value="LSI">LSI &nbsp; (Local Secondary Index)</option>
              </select>
            </div>

            <div class="col-lg-3 col-xl-2 mb-2">
              <label class="form-label">
                Index Name
                <br />
              </label>

              <input
                type="text"
                class="form-control rounded-0"
                placeholder="Enter the partition key name"
                v-model="index.name"
              />
              <!-- <div class="form-text">
                Between 3 and 255 characters, containing only letters, numbers,
                underscores (_), hyphens (-), and periods (.).
              </div> -->
            </div>
            <div class="col-lg-3 col-xl-2 mb-2">
              <label class="form-label">
                Partition key
                <br />
              </label>
              <input
                type="text"
                class="form-control rounded-0"
                placeholder="Enter the partition key name"
                v-model="index.pk.name"
                :disabled="index.type === 'LSI'"
              />
              <!-- <div class="form-text">
                1 to 255 characters and case sensitive.
              </div> -->
            </div>
            <div class="col-lg-3 col-xl-2 mb-2">
              <label class="form-label">
                Partition key type
                <br />
              </label>
              <select
                class="rounded-0 form-select"
                v-model="index.pk.type"
                :disabled="index.type === 'LSI'"
              >
                <option value="S">String</option>
                <option value="N">Number</option>
                <option value="BOOL">Boolean</option>
              </select>
            </div>

            <div class="col-lg-3 col-xl-2 mb-2">
              <label class="form-label">
                Sort key - optional
                <br />
              </label>
              <input
                type="text"
                class="form-control rounded-0"
                placeholder="Enter the sort key name"
                v-model="index.sk.name"
              />
              <!-- <div class="form-text">
                1 to 255 characters and case sensitive.
              </div> -->
            </div>

            <div class="col-lg-3 col-xl-2 mb-2">
              <label class="form-label">
                Sort key type
                <br />
              </label>
              <select
                class="rounded-0 form-select"
                v-model="index.sk.type"
              >
                <option value="S">String</option>
                <option value="N">Number</option>
                <option value="BOOL">Boolean</option>
              </select>
            </div>

            <div class="col-xl-1 mb-2">
              <label class="form-label text-white d-none d-xl-block">--</label>
              <button
                class="btn btn-outline-secondary rounded-0"
                @click="removeSecondaryIndex(i)"
              >
                Remove
              </button>
            </div>
          </div>
          <button
            class="btn btn-outline-secondary rounded-0 my-3"
            @click="addSecondaryIndex"
          >
            Add Secondary Index
          </button>

          <div class="alert alert-info rounded-0 my-4">
            By default, the global secondary index's capacity is the same as your base table's capacity.
          </div>
        </div>
      </div>

      <br />
      <br />

      <div class="bg-white p-4 shadow-sm">
        <code>
          <pre class="mb-0">{{ tableParameters }}</pre>
        </code>
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
          @click="create"
        >
          <span
            class="spinner-grow spinner-grow-sm me-1"
            role="status"
            aria-hidden="true"
            v-if="store.ui.state.isLoading"
          ></span>
          <span class="visually-hidden">Loading...</span>
          Create Table
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
  import { useRouter } from "vue-router";
  import { createTable } from "@/services/table";
  import { onMounted, computed, inject, reactive, ref } from "vue";
  import { generateDynamodbTableParameters } from "@/utils/table";

  const store: any = inject("store");

  onMounted(() => {
    store.table.setters.setTable({ TableName: "Create Table" });
  });

  const table = reactive({
    name: "",
    keySchema: {
      pk: {
        name: "",
        type: "S",
      },
      sk: {
        name: "",
        type: "S",
      },
    },
    throughput: {
      read: 5,
      write: 5,
    },
    indices: [
      // {
      //   type: "GSI",
      //   name: "",
      //   pk: {
      //     name: "",
      //     type: "S",
      //   },
      //   sk: {
      //     name: "",
      //     type: "S",
      //   },
      // },
      // {
      //   type: "LSI",
      //   name: "",
      //   pk: {
      //     name: "",
      //     type: "S",
      //   },
      //   sk: {
      //     name: "",
      //     type: "S",
      //   },
      // },
    ],
  });

  const router = useRouter();

  const reset = () => {
    table.name = "";
    table.keySchema = {
      pk: {
        name: "",
        type: "S",
      },
      sk: {
        name: "",
        type: "S",
      },
    };
    table.throughput = {
      read: 5,
      write: 5,
    };
    table.indices = [];
  };

  const toastRef = ref();
  const toast = reactive({
    className: "",
    message: "",
  });

  const tableParameters = computed(() => generateDynamodbTableParameters(table));

  const create = async () => {
    try {
      await createTable(tableParameters.value);
      reset();
      toast.className = "text-bg-success";
      toast.message = "The table has been created successfully.";
    } catch (error) {
      toast.className = "text-bg-danger";
      toast.message = error.response?.data?.message ?? error.message;
    } finally {
      const toastEl = new bootstrap.Toast(toastRef.value, { delay: 1000 });
      setTimeout(() => toastEl.show(), 0);
    }
  };

  const removeSecondaryIndex = (index) => {
    table.indices.splice(index, 1);
  };

  const addSecondaryIndex = () => {
    table.indices.push({
      type: "GSI",
      name: "",
      pk: {
        name: "",
        type: "S",
      },
      sk: {
        name: "",
        type: "S",
      },
    });
  };

  const cancel = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push({ name: "home" });
    }
  };
</script>
