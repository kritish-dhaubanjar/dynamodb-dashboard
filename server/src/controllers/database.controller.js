import EventEmitter from "events";
import AWS from "../config/aws";
import DatabaseServiceProvider from "../services/database.service";
import { EVENTS } from "../constants/event";

const eventEmitter = new EventEmitter();

export async function index(req, res, next) {
  try {
    const { credentials } = req.body;
    const DatabaseService = new DatabaseServiceProvider(AWS, credentials);
    const data = await DatabaseService.all();

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function stream(req, res, _next) {
  const { uid } = req.params;

  const emit = (id, event, data = {}) => {
    if (id !== uid) return;

    res.write(`data: ${JSON.stringify({ ...data, event })}\n\n`);
  };

  eventEmitter.removeAllListeners();

  eventEmitter.on(EVENTS.BEGIN, (id, payload) => emit(id, EVENTS.BEGIN, payload));
  eventEmitter.on(EVENTS.SUCCESS, (id, payload) => emit(id, EVENTS.SUCCESS, payload));
  eventEmitter.on(EVENTS.FAILURE, (id, payload) => emit(id, EVENTS.FAILURE, payload));
  eventEmitter.on(EVENTS.END, (id, payload) => emit(id, EVENTS.END, payload));
  eventEmitter.on(EVENTS.CLOSE, (id) => emit(id, EVENTS.CLOSE));

  res.writeHead(200, {
    Connection: "keep-alive",
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
  });

  res.write(`data: ${JSON.stringify({ uid, event: EVENTS.ACK })}\n\n`);
}

export async function restore(req, res, next) {
  try {
    const { uid } = req.params;
    const { credentials, tableNames } = req.body;

    const DatabaseService = new DatabaseServiceProvider(AWS, credentials);
    const data = DatabaseService.restore(tableNames, uid, eventEmitter);

    res.json(data);
  } catch (error) {
    next(error);
  }
}
