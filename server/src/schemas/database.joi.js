import Joi from "joi";
import { AWSCredentialsSchema } from "./common/credentials.common.joi";

export const all = Joi.object({
  credentials: AWSCredentialsSchema,
});

export const restore = Joi.object({
  credentials: AWSCredentialsSchema,
  tableNames: Joi.array().items(Joi.string()),
});
