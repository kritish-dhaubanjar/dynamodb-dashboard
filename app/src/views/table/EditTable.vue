<template>
  <div class="row">
    <div class="col-12 col-xl-11">
      <h3 class="mb-3">Edit {{ route.params.tableName }}</h3>

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
                value="GSI"
                disabled
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
                :disabled="index.readOnly"
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
                :disabled="index.type === 'LSI' || index.readOnly"
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
                :disabled="index.type === 'LSI' || index.readOnly"
              >
                <option value="S">String</option>
                <option value="N">Number</option>
                <option value="B">Binary</option>
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
                :disabled="index.readOnly"
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
                :disabled="index.readOnly"
              >
                <option value="S">String</option>
                <option value="N">Number</option>
                <option value="B">Binary</option>
              </select>
            </div>

            <div class="col-xl-1 mb-2">
              <label class="form-label text-white d-none d-xl-block">--</label>
              <button
                class="btn btn-outline-secondary rounded-0"
                @click="removeSecondaryIndex(index.readOnly, i)"
              >
                Remove
              </button>
            </div>
          </div>
          <button
            v-if="!table.indices.length || table.indices.filter(({ readOnly }) => !readOnly).length === 0"
            class="btn btn-outline-secondary rounded-0 my-3"
            @click="addSecondaryIndex"
          >
            Add Secondary Index
          </button>
        </div>
      </div>

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
          @click="update"
        >
          <span
            class="spinner-grow spinner-grow-sm me-1"
            role="status"
            aria-hidden="true"
            v-if="store.ui.state.isLoading"
          ></span>
          <span class="visually-hidden">Loading...</span>
          Update Index
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
  import { useRoute, useRouter } from "vue-router";
  import { getTable, updateTable } from "@/services/table";
  import { computed, inject, onBeforeMount, reactive, ref } from "vue";
  import { generateDynamodbIndexParameters } from "@/utils/table";

  const route = useRoute();
  const router = useRouter();
  const store: any = inject("store");

  onBeforeMount(async () => {
    try {
      const data = await getTable(route.params.tableName.toString());
      store.table.setters.setTable(data);

      table.indices = (data.GlobalSecondaryIndexes ?? []).map(({ IndexName = "", KeySchema = [] }) => {
        const pk = KeySchema.find(({ KeyType }) => KeyType === "HASH");
        const sk = KeySchema.find(({ KeyType }) => KeyType === "RANGE");

        const pkAttributeType = data.AttributeDefinitions.find(
          ({ AttributeName }) => pk?.AttributeName === AttributeName,
        );
        const skAttributeType = data.AttributeDefinitions.find(
          ({ AttributeName }) => sk?.AttributeName === AttributeName,
        );

        return {
          type: "GSI",
          name: IndexName,
          readOnly: true,
          pk: {
            name: pkAttributeType?.AttributeName ?? "",
            type: pkAttributeType?.AttributeType ?? "",
          },
          sk: {
            name: skAttributeType?.AttributeName ?? "",
            type: skAttributeType?.AttributeType ?? "",
          },
        };
      });
    } catch (error) {
      window.location.href = "/";
    }
  });

  const table = reactive({
    indices: [],
    deleteIndices: [],
  });

  const cancel = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push({ name: "home" });
    }
  };

  const reset = () => {
    table.indices = [];
  };

  const toastRef = ref();
  const toast = reactive({
    className: "",
    message: "",
  });

  const update = async () => {
    try {
      await updateTable(route.params.tableName, tableParameters.value);
      reset();
      toast.className = "text-bg-success";
      toast.message = "The table has been updated successfully.";
      setTimeout(cancel, 250);
    } catch (error) {
      toast.className = "text-bg-danger";
      toast.message = error.response?.data?.message ?? error.message;
    } finally {
      const toastEl = new bootstrap.Toast(toastRef.value, { delay: 1000 });
      setTimeout(() => toastEl.show(), 0);
    }
  };

  const removeSecondaryIndex = (readOnly = false, index) => {
    if (readOnly) {
      table.deleteIndices.push(table.indices[index]?.name);
    }

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

  const tableParameters = computed(() => generateDynamodbIndexParameters(table));
</script>
