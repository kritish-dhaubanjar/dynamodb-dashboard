import { reactive } from "vue";
import { isEmpty } from "lodash";
import { generateTableHeaders } from "@/utils/table";

const state = reactive({
  table: {
    page: 1,
    rows: [],
    headers: [] as string[],
    selectedRows: 0,
    count: 0,
    scannedCount: 0,
  },
  isLoading: false,
});

const setters = {
  setIsLoading: (isLoading: boolean) => {
    state.isLoading = isLoading;
  },
  setTable: (table: object, items: [], count = 0, scannedCount = 0) => {
    state.table.rows = items;
    state.table.headers = generateTableHeaders(items, table);

    if (!isEmpty(table)) {
      state.table.count += count;
      state.table.scannedCount += scannedCount;
    } else {
      state.table.count = 0;
      state.table.scannedCount = 0;
    }
  },
  setPage: (page: number) => {
    state.table.page = page;
  },
  setSelectedRows: (selectedRows: number) => {
    state.table.selectedRows = selectedRows;
  },
};

export default {
  state,
  setters,
};
