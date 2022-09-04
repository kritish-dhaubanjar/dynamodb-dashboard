import Joi from "joi";

// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/SQLtoNoSQL.CreateTable.html
// https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBMapper.DataTypes.html

export const create = Joi.object({
  TableName: Joi.string().required(),
  KeySchema: Joi.array()
    .items(
      Joi.object({
        AttributeName: Joi.string().required(),
        KeyType: Joi.string().valid("HASH", "RANGE").required(),
      })
    )
    .has(
      Joi.object({
        AttributeName: Joi.string(),
        KeyType: Joi.string().valid("HASH"),
      })
    )
    .required()
    .min(1),
  AttributeDefinitions: Joi.array()
    .items(
      Joi.object({
        AttributeName: Joi.string().required(),
        AttributeType: Joi.string()
          .valid("N", "S", "BOOL", "B", "SS", "NS", "BS")
          .required(),
      })
    )
    .required()
    .min(1),
  ProvisionedThroughput: Joi.object({
    ReadCapacityUnits: Joi.number().min(1),
    WriteCapacityUnits: Joi.number().min(1),
  }).required(),
});

// https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_UpdateTable.html#DDB-UpdateTable-request-AttributeDefinitions
export const update = Joi.object({
  TableName: Joi.string().required(),
  AttributeDefinitions: Joi.array().items({
    AttributeName: Joi.string(),
    AttributeType: Joi.string()
      .valid("N", "S", "BOOL", "B", "SS", "NS", "BS")
      .required(),
  }),
  GlobalSecondaryIndexUpdates: Joi.array().items(
    Joi.object({
      Create: Joi.object({
        IndexName: Joi.string().required(),
        Projection: Joi.object({
          // NonKeyAttributes: Joi.string(),
          ProjectionType: Joi.string()
            .valid("ALL", "KEYS_ONLY", "INCLUDE")
            .required(),
        }).required(),
        KeySchema: Joi.array()
          .items(
            Joi.object({
              AttributeName: Joi.string().required(),
              KeyType: Joi.string().valid("HASH", "RANGE").required(),
            })
          )
          .has(
            Joi.object({
              AttributeName: Joi.string(),
              KeyType: Joi.string().valid("HASH"),
            })
          )
          .required(),
        ProvisionedThroughput: Joi.object({
          ReadCapacityUnits: Joi.number().min(1),
          WriteCapacityUnits: Joi.number().min(1),
        }).required(),
      }),
      Delete: Joi.object({ IndexName: Joi.string().required() }),
    })
  ),
});
