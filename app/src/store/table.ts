import { reactive } from "vue";

const state = reactive({
  Table: {},
  TableNames: [] as string[],
});

const setters = {
  setTableNames: (tableNames: string[]) => {
    state.TableNames = tableNames;
  },
  setTable: (table: object) => {
    state.Table = table;
  },
};

const getters = {
  getTable: () => {
    return state.Table;
  },
};

export default {
  state,
  setters,
  getters,
};
