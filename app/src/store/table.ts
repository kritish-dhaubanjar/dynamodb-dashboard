import { reactive } from "vue";

const state = reactive({
  Table: {},
  TableNames: [] as string[],
  ForeignKeys: [],
});

const setters = {
  setTableNames: (tableNames: string[]) => {
    state.TableNames = tableNames;
  },
  setTable: (table: object) => {
    state.Table = table;
  },
  setForeignKeys: (foreignKeys) => {
    state.ForeignKeys = foreignKeys;
  },
};

const getters = {
  getTable: () => {
    return state.Table;
  },
  getForeignKeys: () => {
    return state.ForeignKeys;
  },
};

export default {
  state,
  setters,
  getters,
};
