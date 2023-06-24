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

  return data;
}

export async function createTable(body: object) {
  const url = ROUTES.TABLE.CREATE;
  const { data } = await axios.post(url, body);

  return data;
}

export async function deleteTable(tableName: string) {
  const url = interpolate(ROUTES.TABLE.DELETE, { tableName });
  const { data } = await axios.delete(url);

  return data;
}

export async function updateTable(tableName: string, body: object) {
  const url = interpolate(ROUTES.TABLE.UPDATE, { tableName });
  const { data } = await axios.put(url, body);

  return data;
}

export async function getRemoteTables(body: object) {
  const { data } = await axios.post(ROUTES.DATABASE.ALL, body);

  return data;
}

export async function restoreTables(uid:string, body: object) {
  const url = interpolate(ROUTES.DATABASE.RESTORE, { uid });
  const { data } = await axios.post(url, body);

  return data;
}
