<template>
  <div
    class="accordion shadow-sm"
    id="scan-query"
  >
    <div class="accordion-item rounded-0 border-0">
      <h2 class="accordion-header">
        <button
          class="accordion-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseOne"
          aria-expanded="true"
          aria-controls="collapseOne"
        >
          <div>
            <h5 class="mb-0">Scan/Query Items</h5>
            <small>Scan/query a table or index</small>
          </div>
        </button>
      </h2>
      <div
        id="collapseOne"
        class="accordion-collapse collapse show"
        data-bs-parent="#scan-query"
      >
        <div class="accordion-body">
          <p>Scan/query a table or index</p>

          <div class="d-flex">
            <div
              class="btn-group"
              role="group"
            >
              <button
                @click="setOperation('SCAN')"
                class="btn btn-outline-secondary rounded-0 px-4"
                :class="{ active: operation === 'SCAN' }"
              >
                SCAN
              </button>
              <button
                @click="setOperation('QUERY')"
                class="btn btn-outline-secondary rounded-0 px-4"
                :class="{ active: operation === 'QUERY' }"
              >
                QUERY
              </button>
            </div>

            <select
              class="form-select rounded-0 ms-3"
              :value="indexName"
              @change="updateIndexName"
            >
              <option disabled>Table</option>
              <option :value="table.TableName">&nbsp;&nbsp;&nbsp;&nbsp;{{ TableName }}</option>
              <option disabled>Global Secondary Index</option>
              <option
                :value="gsi.IndexName"
                v-for="gsi of GlobalSecondaryIndexes"
                :key="gsi.IndexName"
              >
                &nbsp;&nbsp;&nbsp;&nbsp;{{ gsi.IndexName }}
              </option>
              <option disabled>Local Secondary Index</option>
              <option
                :value="lsi.IndexName"
                v-for="lsi of LocalSecondaryIndexes"
                :key="lsi.IndexName"
              >
                &nbsp;&nbsp;&nbsp;&nbsp;{{ lsi.IndexName }}
              </option>
            </select>
          </div>

          <br />

          <!-- QUERY -->
          <div v-if="operation === 'QUERY'">
            <div class="row">
              <div class="col-xl-7">
                <div v-if="pk">{{ pk?.AttributeName }} (Partition key)</div>
                <div class="input-group mb-3 mt-1">
                  <span class="input-group-text rounded-0">{{ pk?.AttributeType }}</span>
                  <input
                    placeholder="Enter partition key value"
                    type="text"
                    class="form-control rounded-0"
                    :class="{
                      'is-invalid': Object.keys(errors.keys.pk.value).length,
                    }"
                    required
                    v-model="parameters.keys.pk.value"
                  />

                  <div
                    class="invalid-feedback"
                    v-for="errorMessage of errors.keys.pk.value"
                    :key="errorMessage"
                  >
                    {{ errorMessage }}
                  </div>
                </div>
              </div>
            </div>

            <div
              class="row"
              v-if="sk"
            >
              <div v-if="sk">{{ sk?.AttributeName }} (Sort key)</div>
              <!-- https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html -->
              <div class="col-md-2 col-xl-1">
                <select
                  class="form-select mt-1 rounded-0"
                  v-model="parameters.keys.sk.condition"
                >
                  <option value="=">=</option>
                  <option value="<=">&lt;=</option>
                  <option value="<">&lt;</option>
                  <option value=">=">&gt;=</option>
                  <option value=">">&gt;</option>
                  <option value="between">Between</option>
                  <!-- S only -->
                  <option
                    value="begins_with"
                    v-if="sk?.AttributeType === 'S'"
                  >
                    Begins with
                  </option>
                </select>
              </div>
              <div class="col-md-6 col-xl-4">
                <div class="row">
                  <div :class="parameters.keys.sk.condition === 'between' ? 'col-6' : 'col-12'">
                    <div class="input-group mb-3 mt-1">
                      <span class="input-group-text rounded-0">{{ sk?.AttributeType }}</span>
                      <input
                        type="text"
                        placeholder="Enter sort key value"
                        class="form-control rounded-0"
                        v-model="parameters.keys.sk.value1"
                      />
                    </div>
                  </div>

                  <div
                    class="col-6"
                    v-if="parameters.keys.sk.condition === 'between'"
                  >
                    <div class="input-group mb-3 mt-1">
                      <span class="input-group-text rounded-0">{{ sk?.AttributeType }}</span>
                      <input
                        type="text"
                        placeholder="Enter sort key value"
                        class="form-control rounded-0"
                        v-model="parameters.keys.sk.value2"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-3 col-xl-1">
                <div class="text-nowrap mb-3 pt-1 mt-2">
                  <input
                    v-model="parameters.keys.sk.scanIndexForward"
                    class="form-check-input me-1"
                    type="checkbox"
                    id="scanIndexForward"
                  />
                  <label
                    class="form-check-label"
                    for="scanIndexForward"
                  >
                    Sort ascending
                  </label>
                </div>
              </div>
            </div>
          </div>

          <hr class="my-2" />

          <!-- SCAN -->
          <div
            class="accordion accordion-flush"
            id="filters"
          >
            <div class="accordion-item">
              <h2
                class="accordion-header"
                id="flush-headingOne"
              >
                <button
                  class="accordion-button collapsed bg-transparent ps-0 fw-bold"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseOne"
                  aria-expanded="false"
                  aria-controls="flush-collapseOne"
                >
                  Filters
                </button>
              </h2>
              <div
                id="flush-collapseOne"
                ref="collapseRef"
                class="accordion-collapse collapse"
                aria-labelledby="flush-headingOne"
                data-bs-parent="#filters"
              >
                <div class="accordion-body p-0">
                  <div
                    class="row"
                    v-for="(filter, i) of parameters.scan"
                    :key="i"
                  >
                    <div class="col-6 col-xl-2">
                      <label class="mb-1">Attribute Name</label>
                      <SearchDropdown
                        ref="searchDropdownRefs"
                        v-model="filter.name"
                        :items="store.ui.state.table.headers"
                        placeholder="Enter attribute name"
                        :id="`dropdown-input-toggle-${i}`"
                        @select="(value) => (filter.name = value)"
                      />
                    </div>
                    <div class="col-6 col-xl-2">
                      <label class="mb-1">Type</label>
                      <select
                        class="form-select mb-1 rounded-0"
                        v-model="filter.type"
                      >
                        <option value="S">String</option>
                        <option value="N">Number</option>
                        <option
                          value="B"
                          disabled
                        >
                          Binary (Unsupported)
                        </option>
                        <option value="BOOL">Boolean</option>
                        <option value="NULL">Null</option>
                      </select>
                    </div>
                    <div class="col-6 col-xl-2">
                      <label class="mb-1">Condition</label>
                      <select
                        class="form-select mb-1 rounded-0"
                        v-model="filter.condition"
                        @change="(e) => evaluateValue(e, i)"
                      >
                        <option
                          v-for="{ label, value } of FILTER_CONDITIONS_BY_TYPE[filter.type]"
                          :key="value"
                          :value="value"
                        >
                          {{ label }}
                        </option>
                      </select>
                    </div>
                    <div class="col-6 col-xl-4">
                      <label class="mb-1">Value</label>
                      <div class="d-flex mb-2">
                        <div class="row w-100 gx-0">
                          <div :class="filter.condition === 'between' ? 'col-6' : 'col-12'">
                            <input
                              type="text"
                              class="form-control rounded-0"
                              placeholder="Enter attribute value"
                              v-model="filter.value"
                              :disabled="['attribute_exists', 'attribute_not_exists'].includes(filter.condition)"
                            />
                          </div>
                          <!--  -->
                          <div
                            class="col-6 ps-2"
                            :class="{
                              'd-none': filter.condition !== 'between',
                            }"
                          >
                            <input
                              type="text"
                              class="form-control rounded-0"
                              placeholder="Enter attribute value"
                              v-model="filter.value2"
                            />
                          </div>
                        </div>
                        <div class="ms-3 d-none d-xl-block">
                          <button
                            @click="removeFilter(i)"
                            class="btn btn-outline-secondary rounded-0 d-none d-xl-block"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <div class="col-12 col-xl-2">
                      <button
                        @click="removeFilter(i)"
                        class="btn btn-outline-secondary rounded-0 mt-1 d-block d-xl-none mt-2 float-end"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <button
                    class="btn btn-outline-secondary rounded-0 mt-1 mt-2"
                    @click="addFilter"
                  >
                    Add Filter
                  </button>
                </div>
              </div>
            </div>
          </div>

          <br />

          <code>
            <pre>{{ dynamodbParameters }}</pre>
          </code>

          <button
            type="button"
            class="btn btn-primary rounded-0 px-4 mb-2"
            @click="run"
          >
            RUN
          </button>

          <button
            type="button"
            class="btn btn-outline-secondary rounded-0 px-4 mb-2 ms-2"
            @click="resetParameters"
          >
            RESET
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import * as bootstrap from "bootstrap";
  import { useRoute, useRouter } from "vue-router";
  import { generateDynamodbParameters } from "@/utils/table";
  import FILTER_CONDITIONS_BY_TYPE from "@/constants/conditions";
  import { computed, inject, onMounted, reactive, ref, watch, watchEffect } from "vue";
  import SearchDropdown from "@/components/common/SearchDropdown.vue";

  const route = useRoute();
  const router = useRouter();
  const store: any = inject("store");
  const table = computed(() => store.table.state.Table);

  const searchDropdownRefs = ref<[{ clear: () => void }]>([]);

  const KeySchema = computed(() => table.value.KeySchema ?? []);
  const TableName = computed(() => table.value.TableName ?? route.query.tableName);
  const AttributeDefinitions = computed(() => table.value.AttributeDefinitions ?? []);
  const GlobalSecondaryIndexes = computed(() => table.value.GlobalSecondaryIndexes ?? []);
  const LocalSecondaryIndexes = computed(() => table.value.LocalSecondaryIndexes ?? []);

  const pk = computed(() => queryKeySchema.value.find(({ KeyType = "" }) => KeyType === "HASH"));

  const sk = computed(() => queryKeySchema.value.find(({ KeyType = "" }) => KeyType === "RANGE"));

  onMounted(() => {
    if (collapseRef.value) {
      const collapse = new bootstrap.Collapse(collapseRef.value);
      collapse.show();
    }
  });

  const collapseRef = ref(null);
  const operation = ref("");
  const indexName = ref("");
  const parameters = reactive({
    keys: {
      pk: {
        value: "",
        condition: "=",
      },
      sk: {
        value1: "",
        value2: "",
        condition: "=",
        scanIndexForward: true,
      },
    },
    scan: [
      {
        name: "",
        type: "S",
        value: "",
        value2: "",
        condition: "=",
      },
    ],
  });

  const defaultErrors = {
    keys: {
      pk: {
        value: {} as Record<string, string>,
      },
    },
  };

  const errors = reactive(structuredClone(defaultErrors));

  watchEffect(() => {
    indexName.value = route.query.indexName?.toString() ?? TableName.value;
    operation.value = route.query.operation?.toString();
  });

  watch(
    () => [route.query.tableName],
    ([tableName], [oldTableName]) => {
      if (tableName !== oldTableName) {
        resetParameters();
      }
    },
  );

  watchEffect(() => {
    const queryParameters = route.query.parameters;

    if (queryParameters) {
      try {
        const parsedParameters = JSON.parse(decodeURIComponent(queryParameters.toString()));
        Object.keys(parsedParameters.keys ?? []).forEach((key) => {
          parameters.keys[key] = parsedParameters.keys[key];
        });
        parameters.scan = parsedParameters.scan ?? [];
      } catch (error) {
        console.log(error);
      }
    }
  });

  const queryKeySchema = computed(() => {
    let keySchema = [];

    if (indexName.value === TableName.value) {
      keySchema = KeySchema.value ?? [];
    } else {
      const secondaryIndex = [...GlobalSecondaryIndexes.value, ...LocalSecondaryIndexes.value].find(
        ({ IndexName }: { IndexName: string }) => IndexName === indexName.value,
      );
      keySchema = secondaryIndex?.KeySchema ?? [];
    }

    const keySchemaWithAttributeType = keySchema.map((key) => {
      const { AttributeType } = AttributeDefinitions.value.find(
        (attributeDefinition: any) => key.AttributeName === attributeDefinition.AttributeName,
      );

      return {
        ...key,
        AttributeType,
      };
    });

    return keySchemaWithAttributeType;
  });

  //
  const setOperation = (op) => {
    resetParameters();
    operation.value = op;
  };

  const resetErrors = () => {
    const errorKeys = Object.keys(defaultErrors) as Array<keyof typeof defaultErrors>;

    errorKeys.forEach((key) => {
      Object.assign(errors[key], structuredClone(defaultErrors[key]));
    });
  };

  const resetParameters = (resetOperation = true) => {
    resetErrors();

    if (resetOperation) {
      operation.value = "SCAN";
    }

    parameters.keys.pk = {
      value: "",
      condition: "=",
    };

    parameters.keys.sk = {
      value1: "",
      value2: "",
      condition: "=",
      scanIndexForward: true,
    };

    parameters.scan = [
      {
        name: "",
        type: "S",
        value: "",
        value2: "",
        condition: "=",
      },
    ];

    searchDropdownRefs.value.forEach((searchDropdownRef) => searchDropdownRef.clear());
  };

  const updateIndexName = (e: any) => {
    const resetOperation = false;
    resetParameters(resetOperation);
    indexName.value = e.target.value;
  };

  const validateInput = (input: typeof parameters) => {
    if (!input.keys.pk.value) {
      errors.keys.pk.value.required = "Partition key value is required";

      return false;
    }

    return true;
  };

  const run = async () => {
    const updatedParameters = { ...parameters };

    resetErrors();

    if (operation.value === "SCAN") {
      updatedParameters.keys.pk = {
        value: "",
        condition: "=",
      };

      updatedParameters.keys.sk = {
        value1: "",
        value2: "",
        condition: "=",
        scanIndexForward: true,
      };
    }

    if (operation.value === "QUERY") {
      const isValid = validateInput(parameters);

      if (!isValid) {
        return;
      }
    }

    router.push({
      name: "home",
      params: route.params,
      query: {
        ...route.query,
        requestId: Date.now(),
        operation: operation.value,
        indexName: indexName.value,
        parameters: dynamodbParameters.value ? encodeURIComponent(JSON.stringify(parameters)) : null,
      },
    });
  };

  const evaluateValue = (e, i) => {
    if (["attribute_exists", "attribute_not_exists"].includes(e.target.value)) {
      parameters.scan[i].value = "";
      parameters.scan[i].value2 = "";
    }
  };

  const addFilter = () => {
    parameters.scan.push({
      name: "",
      type: "S",
      value: "",
      value2: "",
      condition: "=",
    });
  };

  const removeFilter = (index) => {
    const filteredFilters = [...parameters.scan];
    filteredFilters.splice(index, 1);
    parameters.scan = filteredFilters;
  };

  const dynamodbParameters = computed(() => {
    if (!table.value.TableName) {
      return;
    }

    const preview = generateDynamodbParameters({
      parameters,
      table: table.value,
      indexName: indexName.value,
    });

    if (preview && operation.value === "SCAN") {
      delete preview["KeyConditionExpression"];
      delete preview["ScanIndexForward"];
    }

    if (preview && preview["ScanIndexForward"]) {
      delete preview["ScanIndexForward"];
    }

    return preview && Object.keys(preview).length ? preview : null;
  });
</script>

<style lang="scss" scoped>
  .dropdown-menu {
    z-index: 1028 !important;
    max-height: 200px;
    overflow-y: auto;
  }

  .dropdown-item {
    cursor: pointer;
    &:hover {
      background-color: #f8f9fa;
    }
  }
</style>
