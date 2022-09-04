import { create, update } from "../schemas/table.joi";

export function validateCreate(req, res, next) {
  const { error } = create.validate(req.body);
  if (error) return next(error);
  next();
}

export function validateUpdate(req, res, next) {
  const { error } = update.validate(req.body);
  if (error) return next(error);

  next();
}
