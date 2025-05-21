import axios from "axios";
import { isNil } from "lodash";
import ROUTES from "../constants/routes";
import { interpolate } from "../utils/string";

export async function queryItems(tableName: string, params: any) {
  const url = interpolate(ROUTES.ITEM.QUERY, { tableName });

  const filteredParams: any = {};

  Object.keys(params).forEach((key) => {
    if (!isNil(params[key])) {
      filteredParams[key] = params[key];
    }
  });

  const { data } = await axios.post(url, filteredParams);

  return data;
}

export async function scanItems(tableName: string, params: any) {
  const url = interpolate(ROUTES.ITEM.SCAN, { tableName });

  const filteredParams: any = {};

  Object.keys(params).forEach((key) => {
    if (!isNil(params[key])) {
      filteredParams[key] = params[key];
    }
  });

  const { data } = await axios.post(url, filteredParams);

  return data;
}

export async function countItems(tableName: string, params: any) {
  const url = interpolate(ROUTES.ITEM.COUNT, { tableName });

  const filteredParams: any = {};

  Object.keys(params).forEach((key) => {
    if (!isNil(params[key])) {
      filteredParams[key] = params[key];
    }
  });

  delete filteredParams.Limit;
  delete filteredParams.ExclusiveStartKey;

  const { data } = await axios.post(url, filteredParams);

  return data;
}

export async function truncateItems(tableName: string, params: any) {
  const url = interpolate(ROUTES.ITEM.TRUNCATE, { tableName });

  const filteredParams: any = {};

  Object.keys(params).forEach((key) => {
    if (!isNil(params[key])) {
      filteredParams[key] = params[key];
    }
  });

  delete filteredParams.Limit;
  delete filteredParams.ExclusiveStartKey;

  const { data } = await axios.put(url, filteredParams);

  return data;
}

export async function updateItem(tableName: string, original: any, body: any, KeySchema: []) {
  const url = interpolate(ROUTES.ITEM.UPDATE, { tableName });

  const ref: any = {};
  const newRef: any = {};

  KeySchema.forEach(({ AttributeName }) => {
    ref[AttributeName] = original[AttributeName];
    newRef[AttributeName] = body[AttributeName];
  });

  const { data } = await axios.put(url, {
    ref,
    body,
  });

  return { data, ref: newRef, body };
}

export async function getItem(tableName: string, params: any, AttributeDefinitions: []) {
  const url = interpolate(ROUTES.ITEM.GET, { tableName });

  const formattedParams: any = {};

  Object.keys(params).forEach((key) => {
    const { AttributeType } = AttributeDefinitions.find(({ AttributeName }) => AttributeName === key) ?? {
      AttributeType: "S",
    };

    switch (AttributeType) {
      case "N":
        formattedParams[key] = parseInt(params[key]);
        break;
      default:
        formattedParams[key] = params[key];
        break;
    }
  });

  const { data } = await axios.post(url, formattedParams);

  return data;
}

export async function destroyItems(tableName: string, keys: []) {
  const url = interpolate(ROUTES.ITEM.DELETE, { tableName });

  const params: any[] = [];

  keys.forEach((key) => {
    const param = {
      DeleteRequest: {
        Key: key,
      },
    };
    params.push(param);
  });

  const { data } = await axios.post(url, params);

  return data;
}

export async function createItem(tableName: string, body: any) {
  const url = interpolate(ROUTES.ITEM.CREATE, { tableName });

  const { data } = await axios.post(url, body);

  return { data, body };
}
