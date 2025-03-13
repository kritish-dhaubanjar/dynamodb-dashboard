import Joi from "joi";
import { AWSCredentialsSchema } from "./common/credentials.common.joi";

export const all = Joi.object({
  credentials: AWSCredentialsSchema,
});

export const restore = Joi.object({
  credentials: AWSCredentialsSchema,
  tables: Joi.array().items(
    Joi.object({
      source: Joi.string().required(),
      target: Joi.string().required(),
    }),
  ),
});
