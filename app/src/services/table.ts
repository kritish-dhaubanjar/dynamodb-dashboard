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

export async function getTableTTL(tableName: string) {
  const url = interpolate(ROUTES.TABLE.TTL, { tableName });
  const { data } = await axios.get(url);

  return data.TimeToLiveDescription;
}

export async function updateTableTTL(tableName: string, body: object) {
  const url = interpolate(ROUTES.TABLE.TTL, { tableName });
  const { data } = await axios.put(url, body);

  return data.TimeToLiveDescription;
}

export async function updateTableStream(tableName: string, body: object) {
  const url = interpolate(ROUTES.TABLE.STREAM, { tableName });
  const { data } = await axios.put(url, body);

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

export async function truncateTable(tableName: string) {
  const url = interpolate(ROUTES.TABLE.TRUNCATE, { tableName });
  const { data } = await axios.put(url);

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

export async function restoreTables(uid: string, body: object) {
  const url = interpolate(ROUTES.DATABASE.RESTORE, { uid });
  const { data } = await axios.post(url, body);

  return data;
}
