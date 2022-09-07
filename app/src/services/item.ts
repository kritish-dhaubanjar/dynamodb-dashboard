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
