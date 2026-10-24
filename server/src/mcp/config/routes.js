export default {
  TABLE: {
    INDEX: "/tables",
    DESCRIBE: "/tables/:tableName/describe",
    DESCRIBE_TTL: "/tables/:tableName/time-to-live",
  },
  ITEM: {
    GET: "/tables/:tableName/items/get",
    SCAN: "/tables/:tableName/items/scan",
    QUERY: "/tables/:tableName/items/query",
    COUNT: "/tables/:tableName/items/count",
  },
};
