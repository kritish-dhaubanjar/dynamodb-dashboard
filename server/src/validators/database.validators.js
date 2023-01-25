import { all, restore } from "../schemas/database.joi";

export function validateRestore(req, _res, next) {
  const { error } = restore.validate(req.body);
  if (error) return next(error);
  next();
}

export function validateAll(req, _res, next) {
  const { error } = all.validate(req.body);
  if (error) return next(error);
  next();
}
