import { get, set, pick } from "lodash";
import { BillingMode } from "@aws-sdk/client-dynamodb";
import { create as TableSchema } from "../schemas/table.joi";

/**
 * @param {object} Table
 *
 * @returns {object}
 */
export function constructSchema(Table) {
  const keys = Object.keys(TableSchema.describe().keys);
  const schema = pick(Table, keys);

  schema.BillingMode = Table.BillingModeSummary?.BillingMode || BillingMode.PROVISIONED;

  if (schema.BillingMode !== BillingMode.PAY_PER_REQUEST) {
    return schema;
  }

  delete schema.ProvisionedThroughput;

  if (schema.GlobalSecondaryIndexes) {
    schema.GlobalSecondaryIndexes.forEach((gsi) => delete gsi.ProvisionedThroughput);
  }

  return schema;
}

/**
 * https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes
 *
 * @param {object} Item
 * @param {string} path
 * @param {function} callback
 *
 * @returns {object}
 */
export function serialize(Item, path = "", callback = () => {}) {
  if (["string", "number", "boolean"].includes(typeof Item) || Item === null) {
    return Item;
  }

  if (Item instanceof Set) {
    callback(path);
    return Array.from(Item);
  }

  if (Item instanceof Array) {
    return Item.map((value, index) => serialize(value, `${path}[${index}]`, callback));
  }

  const output = {};

  Object.entries(Item).forEach(([key, value]) => {
    const currentPath = path ? `${path}.${key}` : key;

    if (value instanceof Set) {
      callback(currentPath);
      output[key] = Array.from(value);
      return;
    }

    if (value instanceof Array) {
      output[key] = value.map((item, index) => serialize(item, `${currentPath}[${index}]`, callback));
      return;
    }

    if (value instanceof Object) {
      output[key] = serialize(value, currentPath, callback);
      return;
    }

    output[key] = value;
  });

  return output;
}

/**
 * @param {object} object
 * @param {object} source
 *
 * @returns {object}
 */
export function deserialize(source = {}, object = {}) {
  const paths = [];

  serialize(source, "", (path) => paths.push(path));

  paths.forEach((path) => {
    const value = get(object, path);

    if (value instanceof Array) {
      set(object, path, new Set(value));
    }
  });

  return object;
}
