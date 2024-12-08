import axios from "axios";
import ROUTES from "../constants/routes";

export async function connect(body: object) {
  const { data } = await axios.put(ROUTES.DATABASE.CONNECT, body);

  return data;
}

export async function disconnect() {
  const { data } = await axios.put(ROUTES.DATABASE.DISCONNECT, {});

  return data;
}
