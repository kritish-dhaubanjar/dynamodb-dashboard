import axios from "axios";
import ROUTES from "../constants/routes";
import { interpolate } from "../utils/string";

export async function getTables() {
  const { data } = await axios.get(ROUTES.TABLE.ALL);
  return data;
}

export async function getTable(tableName: string) {
  const url = interpolate(ROUTES.TABLE.DESCRIBE, { tableName });
  const { data } = await axios.get(url);

  return data.Table;
}
