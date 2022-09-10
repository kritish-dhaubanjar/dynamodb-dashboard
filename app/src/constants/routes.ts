const routes = {
  TABLE: {
    ALL: "/tables",
    CREATE: "/tables",
    GET: "/tables/:tableName",
    DELETE: "/tables/:tableName",
    UPDATE: "/tables/:tableName",
    DESCRIBE: "/tables/:tableName/describe",
  },
  ITEM: {
    CREATE: "/tables/:tableName/items",
    GET: "/tables/:tableName/items/get",
    UPDATE: "/tables/:tableName/items",
    DELETE: "/tables/:tableName/items",
    SCAN: "/tables/:tableName/items/scan",
    QUERY: "/tables/:tableName/items/query",
  },
};

export default routes;
