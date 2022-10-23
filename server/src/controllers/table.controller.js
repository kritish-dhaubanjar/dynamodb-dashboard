import * as TableService from "../services/table.service";

export async function index(_req, res, next) {
  try {
    const tables = await TableService.all();
    return res.json(tables);
  } catch (error) {
    next(error);
  }
}

export async function create(req, res, next) {
  try {
    const tables = await TableService.create(req.body);
    return res.json(tables);
  } catch (error) {
    next(error);
  }
}

export async function describe(req, res, next) {
  try {
    const tableName = req.params.tableName;
    const data = await TableService.describe(tableName);
    return res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function destroy(req, res, next) {
  try {
    const tableName = req.params.tableName;
    const data = await TableService.destroy(tableName);
    return res.json(data);
  } catch (error) {
    next(error);
  }
}

export async function update(req, res, next) {
  try {
    const tableName = req.params.tableName;
    const data = await TableService.update(tableName, req.body);
    return res.json(data);
  } catch (error) {
    next(error);
  }
}
