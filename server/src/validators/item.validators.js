import Joi from "joi";
import { scan, destroy, query, count } from "../schemas/item.joi";
import TableServiceProvider from "../services/table.service";

const TableService = new TableServiceProvider();

export function validateScan(req, _res, next) {
  const { error } = scan.validate(req.body);

  if (error) {
    next(error);

    return;
  }

  next();
}

export function validateQuery(req, _res, next) {
  const { error } = query.validate(req.body);

  if (error) {
    next(error);

    return;
  }

  next();
}

export function validateCount(req, _res, next) {
  const { error } = count.validate(req.body);

  if (error) {
    next(error);

    return;
  }

  next();
}

export async function validateTruncate(req, _res, next) {
  const { tableName } = req.params;

  try {
    const { Table } = await TableService.describe(tableName);

    const schema = {};

    Table.KeySchema.forEach(({ AttributeName }) => {
      schema[AttributeName] = Joi.any().required();
    });

    const { error } = count.validate(req.body);

    if (error) {
      next(error);
      return;
    }

    req.schema = Object.keys(schema);

    next();
  } catch (error) {
    next(error);
  }
}

export function validateDelete(req, _res, next) {
  const { error } = destroy.validate(req.body);

  if (error) {
    next(error);

    return;
  }

  next();
}

export async function validateCreate(req, _res, next) {
  const { tableName } = req.params;

  try {
    const { Table } = await TableService.describe(tableName);

    const schema = {};
    Table.KeySchema.forEach(({ AttributeName }) => {
      schema[AttributeName] = Joi.any().required();
    });

    const create = Joi.object(schema).unknown(true);

    const { error } = create.validate(req.body);

    if (error) {
      next(error);
      return;
    }

    req.schema = Object.keys(schema);

    next();
  } catch (error) {
    next(error);
  }
}

export async function validateUpdate(req, _res, next) {
  const { tableName } = req.params;

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

    if (error) {
      next(error);
      return;
    }

    req.schema = Object.keys(schema);

    next();
  } catch (error) {
    next(error);
  }
}
