import Joi from "joi";

export const AWSCredentialsSchema = Joi.object({
  AWS_REGION: Joi.string().required(),
  AWS_ENDPOINT: Joi.string().required(),
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_SESSION_TOKEN: Joi.string().empty('').optional(),
})
