import Joi from "joi";

export const scan = Joi.object({
  Limit: Joi.number().greater(0).required(),
  //
  IndexName: Joi.string().optional(),
  ExclusiveStartKey: Joi.any().optional(),
  FilterExpression: Joi.string().optional(),
  ExpressionAttributeNames: Joi.object().when("FilterExpression", {
    is: Joi.exist(),
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  ExpressionAttributeValues: Joi.object().optional(), // attribute_exists(#tag)
});

export const query = Joi.object({
  Limit: Joi.number().greater(0).required(),
  KeyConditionExpression: Joi.string().required(),
  ExpressionAttributeNames: Joi.object().required(),
  ExpressionAttributeValues: Joi.object().optional(), // attribute_exists(#tag)
  //
  IndexName: Joi.string().optional(),
  ExclusiveStartKey: Joi.any().optional(),
  FilterExpression: Joi.string().optional(),
});

export const destroy = Joi.array()
  .items(
    Joi.object({
      DeleteRequest: Joi.object({
        Key: Joi.object().required(),
      }).required(),
    })
  )
  .min(1);
