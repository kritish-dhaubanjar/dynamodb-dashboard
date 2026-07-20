import { OPERATIONS } from "../constants/dynamodb";
import { isPartialMatchWith } from "../utils/object";
import { normalizeKeys } from "../utils/dynamodb";
import ItemServiceProvider from "../services/item.service";

const ItemService = new ItemServiceProvider();

export async function get(req, res, next) {
  try {
    const { tableName } = req.params;
    const keys = normalizeKeys(req.body, req.attributeDefinitions);
    const data = await ItemService.get(tableName, keys);

    if (!data.Item) {
      res.status(404);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function scan(req, res, next) {
  try {
    const { tableName } = req.params;
    const data = await ItemService.fetch(OPERATIONS.SCAN, tableName, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function query(req, res, next) {
  try {
    const { tableName } = req.params;
    const data = await ItemService.fetch(OPERATIONS.QUERY, tableName, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function count(req, res, next) {
  try {
    const { tableName } = req.params;
    const data = await ItemService.count(tableName, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function truncate(req, res, next) {
  try {
    const { tableName } = req.params;
    const data = await ItemService.truncate(tableName, req.schema, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function destroy(req, res, next) {
  try {
    const { tableName } = req.params;
    const items = req.body.map((item) => ({
      DeleteRequest: {
        Key: normalizeKeys(item.DeleteRequest.Key, req.attributeDefinitions),
      },
    }));
    const data = await ItemService.destroy(tableName, items);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const { tableName } = req.params;
    const data = await ItemService.create(tableName, req.schema, req.body);
    res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { ref, body } = req.body;
    const { tableName } = req.params;
    const normalizedBody = {
      ref: normalizeKeys(ref, req.attributeDefinitions),
      body,
    };

    const isReplace = isPartialMatchWith(normalizedBody.ref, body, req.schema);

    let data;

    if (isReplace) {
      data = await ItemService.update(tableName, req.schema, normalizedBody);
    } else {
      data = await ItemService.transactUpdate(tableName, req.schema, normalizedBody);
    }

    res.json(data);
  } catch (error) {
    next(error);
  }
}
