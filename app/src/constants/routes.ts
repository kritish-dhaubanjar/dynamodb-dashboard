const routes = {
  TABLE: {
    ALL: "/tables",
    CREATE: "/tables",
    GET: "/tables/:tableName",
    DELETE: "/tables/:tableName",
    UPDATE: "/tables/:tableName",
    TRUNCATE: "/tables/:tableName/truncate",
    DESCRIBE: "/tables/:tableName/describe",
    TTL: "/tables/:tableName/time-to-live",
  },
  DATABASE: {
    ALL: "/database/tables",
    RESTORE: "/database/restore/:uid",
    STREAM: "/database/stream/:uid",
    CONNECT: "/database/connect",
    DISCONNECT: "/database/disconnect",
    ABORT: "/database/restore/abort",
  },
  ITEM: {
    CREATE: "/tables/:tableName/items",
    GET: "/tables/:tableName/items/get",
    UPDATE: "/tables/:tableName/items",
    SCAN: "/tables/:tableName/items/scan",
    QUERY: "/tables/:tableName/items/query",
    COUNT: "/tables/:tableName/items/count",
    TRUNCATE: "/tables/:tableName/items/truncate",
    DELETE: "/tables/:tableName/items/delete",
  },
};

export default routes;
