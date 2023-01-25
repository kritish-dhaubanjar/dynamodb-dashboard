import { OPERATIONS } from "../constants/dynamodb";
import { isPartialMatchWith } from "../utils/object";
import ItemServiceProvider from "../services/item.service";

const ItemService = new ItemServiceProvider();

export async function get(req, res, next) {
  try {
    const tableName = req.params.tableName;
    const data = await ItemService.get(tableName, req.body);

    if (!data.Item) {
      res.status(404);
    }

    return res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function scan(req, res, next) {
  try {
    const tableName = req.params.tableName;
    const data = await ItemService.fetch(OPERATIONS.SCAN, tableName, req.body);
    return res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function query(req, res, next) {
  try {
    const tableName = req.params.tableName;
    const data = await ItemService.fetch(OPERATIONS.QUERY, tableName, req.body);
    return res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function destroy(req, res, next) {
  try {
    const tableName = req.params.tableName;
    const data = await ItemService.destroy(tableName, req.body);
    return res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const tableName = req.params.tableName;
    const data = await ItemService.create(tableName, req.schema, req.body);
    return res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const { ref, body } = req.body;
    const tableName = req.params.tableName;

    const isReplace = isPartialMatchWith(ref, body, req.schema);

    let data;

    if (isReplace) {
      data = await ItemService.update(tableName, req.schema, req.body);
    } else {
      data = await ItemService.transactUpdate(tableName, req.schema, req.body);
    }

    return res.json(data);
  } catch (error) {
    next(error);
  }
}
