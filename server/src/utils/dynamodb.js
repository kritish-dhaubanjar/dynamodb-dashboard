import { get, set, pick } from "lodash-es";
import { NumberValue } from "@aws-sdk/lib-dynamodb";
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

    if (typeof value === "bigint") {
      callback(currentPath);
      output[key] = String(value);
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

    if (typeof value === "string") {
      set(object, path, new NumberValue(value));
    }
  });

  return object;
}

function isBinaryLikeObject(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const keys = Object.keys(value);

  if (keys.length === 0) {
    return false;
  }

  return keys.every((key) => /^\d+$/.test(key) && Number.isInteger(value[key]) && value[key] >= 0 && value[key] <= 255);
}

function toBinary(value) {
  if (value instanceof Uint8Array) {
    return value;
  }

  if (typeof Buffer !== "undefined" && Buffer.isBuffer(value)) {
    return new Uint8Array(value);
  }

  if (typeof value === "string") {
    return new Uint8Array(Buffer.from(value, "base64"));
  }

  if (isBinaryLikeObject(value)) {
    const bytes = Object.keys(value)
      .map(Number)
      .sort((a, b) => a - b)
      .map((index) => value[String(index)]);

    return new Uint8Array(bytes);
  }

  return value;
}

export function normalizeKeys(keys = {}, attributeDefinitions = []) {
  const output = { ...keys };

  attributeDefinitions.forEach(({ AttributeName, AttributeType }) => {
    if (!Object.hasOwn(output, AttributeName)) {
      return;
    }

    if (AttributeType === "B") {
      output[AttributeName] = toBinary(output[AttributeName]);
    }

    if (AttributeType === "N") {
      output[AttributeName] = Number(output[AttributeName]);
    }
  });

  return output;
}
