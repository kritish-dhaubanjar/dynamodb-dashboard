import Joi from "joi";
import {
  KeySchemaSchema,
  ProjectionSchema,
  AttributeDefinitionsSchema,
  ProvisionedThroughputSchema,
} from "./common/table.common.joi";

// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SQLtoNoSQL.CreateTable.html
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBMapper.DataTypes.html

export const create = Joi.object({
  TableName: Joi.string().required(),
  KeySchema: KeySchemaSchema,
  AttributeDefinitions: AttributeDefinitionsSchema,
  ProvisionedThroughput: ProvisionedThroughputSchema,
  GlobalSecondaryIndexes: Joi.array().items(
    Joi.object({
      IndexName: Joi.string().required(),
      KeySchema: KeySchemaSchema,
      Projection: ProjectionSchema,
      ProvisionedThroughput: ProvisionedThroughputSchema,
    })
  ),
  LocalSecondaryIndexes: Joi.array().items(
    Joi.object({
      IndexName: Joi.string().required(),
      KeySchema: KeySchemaSchema,
      Projection: ProjectionSchema,
    })
  ),
});

// https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateTable.html#DDB-UpdateTable-request-AttributeDefinitions
export const update = Joi.object({
  AttributeDefinitions: AttributeDefinitionsSchema.optional(),
  GlobalSecondaryIndexUpdates: Joi.array().items(
    Joi.object({
      Create: Joi.object({
        IndexName: Joi.string().required(),
        Projection: ProjectionSchema,
        KeySchema: KeySchemaSchema,
        ProvisionedThroughput: ProvisionedThroughputSchema,
      }),
      Delete: Joi.object({ IndexName: Joi.string().required() }),
    })
  ),
});
