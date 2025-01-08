import { create, update, updateTimeToLive } from "../schemas/table.joi";

export function validateCreate(req, _res, next) {
  const { error } = create.validate(req.body);

  if (error) {
    next(error);

    return;
  }

  next();
}

export function validateUpdate(req, _res, next) {
  const { error } = update.validate(req.body);

  if (error) {
    next(error);

    return;
  }

  next();
}

export function validateUpdateTimeToLive(req, _res, next) {
  const { error } = updateTimeToLive.validate(req.body);

  if (error) {
    next(error);

    return;
  }

  next();
}
