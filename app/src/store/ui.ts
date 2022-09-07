import { reactive } from "vue";
import { generateTableHeaders } from "@/utils/table";

const state = reactive({
  table: {
    page: 1,
    rows: [],
    headers: [] as string[],
  },
  isLoading: false,
});

const setters = {
  setIsLoading: (isLoading: boolean) => {
    state.isLoading = isLoading;
  },
  setTable: (table: object, items: []) => {
    state.table.rows = items;
    state.table.headers = generateTableHeaders(items, table);
  },
  setPage: (page: number) => {
    state.table.page = page;
  },
};

export default {
  state,
  setters,
};
