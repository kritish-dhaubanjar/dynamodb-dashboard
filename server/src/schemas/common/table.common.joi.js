import Joi from "joi";

// KeySchema
export const KeySchemaSchema = Joi.array()
  .items(
    Joi.object({
      AttributeName: Joi.string().required(),
      KeyType: Joi.string().valid("HASH", "RANGE").required(),
    }),
  )
  .has(
    Joi.object({
      AttributeName: Joi.string(),
      KeyType: Joi.string().valid("HASH"),
    }),
  )
  .required()
  .min(1);

// ProvisionedThroughput
export const ProvisionedThroughputSchema = Joi.object({
  ReadCapacityUnits: Joi.number().min(1),
  WriteCapacityUnits: Joi.number().min(1),
}).required();

// ProjectionSchema
export const ProjectionSchema = Joi.object({
  ProjectionType: Joi.string().valid("ALL", "KEYS_ONLY" /*"INCLUDE"*/).required(),
}).required();

// AttributeDefinitions
export const AttributeDefinitionsSchema = Joi.array()
  .items(
    Joi.object({
      AttributeName: Joi.string().required(),
      AttributeType: Joi.string().valid("N", "S", "BOOL", "B", "SS", "NS", "BS").required(),
    }),
  )
  .required()
  .min(1);
