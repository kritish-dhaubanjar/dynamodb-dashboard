import axios from "axios";
import ROUTES from "../constants/routes";
import { interpolate } from "../utils/string";

export async function scanItems(tableName: string, params: any) {
  const url = interpolate(ROUTES.ITEM.SCAN, { tableName });

  const filteredParams: any = {};
  Object.keys(params).forEach((key) => {
    if (params[key]) filteredParams[key] = params[key];
  });

  const { data } = await axios.post(url, filteredParams);

  return data;
}

export async function updateItem(
  tableName: string,
  original: any,
  body: any,
  KeySchema: []
) {
  const url = interpolate(ROUTES.ITEM.UPDATE, { tableName });

  const ref: any = {};

  KeySchema.forEach(({ AttributeName }) => {
    ref[AttributeName] = original[AttributeName];
  });

  const { data } = await axios.put(url, {
    ref,
    body,
  });

  return data;
}

export async function getItem(
  tableName: string,
  params: any,
  AttributeDefinitions: []
) {
  const url = interpolate(ROUTES.ITEM.GET, { tableName });

  const formattedParams: any = {};

  Object.keys(params).forEach((key) => {
    const { AttributeType } = AttributeDefinitions.find(
      ({ AttributeName }) => AttributeName === key
    ) ?? { AttributeType: "S" };

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
