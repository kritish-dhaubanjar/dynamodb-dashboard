import Joi from "joi";
import * as TableService from "../services/table.service";
import { scan, destroy, query } from "../schemas/item.joi";

export function validateScan(req, _res, next) {
  const { error } = scan.validate(req.body);
  if (error) return next(error);
  next();
}

export function validateQuery(req, _res, next) {
  const { error } = query.validate(req.body);
  if (error) return next(error);
  next();
}

export function validateDelete(req, _res, next) {
  const { error } = destroy.validate(req.body);
  if (error) return next(error);
  next();
}

export async function validateCreate(req, _res, next) {
  const tableName = req.params.tableName;

  try {
    const { Table } = await TableService.describe(tableName);

    const schema = {};
    Table.KeySchema.forEach(({ AttributeName }) => {
      schema[AttributeName] = Joi.any().required();
    });

    const create = Joi.object(schema).unknown(true);

    const { error } = create.validate(req.body);
    if (error) return next(error);

    req.schema = Object.keys(schema);

    next();
  } catch (error) {
    return next(error);
  }
}

export async function validateUpdate(req, _res, next) {
  const tableName = req.params.tableName;

  try {
    const { Table } = await TableService.describe(tableName);

    const schema = {};

    Table.KeySchema.forEach(({ AttributeName }) => {
      schema[AttributeName] = Joi.any().required();
    });

    const update = Joi.object({
      ref: Joi.object(schema).required(),
      body: Joi.object(schema).unknown(true).required(),
    });

    const { error } = update.validate(req.body);
    if (error) return next(error);

    req.schema = Object.keys(schema);

    next();
  } catch (error) {
    return next(error);
  }
}
