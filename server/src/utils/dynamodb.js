import { pick } from "./object";
import { create as TableSchema } from "../schemas/table.joi";
import { ProvisionedThroughput } from '../constants/dynamodb';

export function constructSchema(Table) {
  const keys = Object.keys(TableSchema.describe().keys);
  const schema = pick(Table, keys);

  schema.ProvisionedThroughput = ProvisionedThroughput;

  if (schema.GlobalSecondaryIndexes) {
    schema.GlobalSecondaryIndexes = schema.GlobalSecondaryIndexes.map((gsi) => ({
      ...gsi,
      ProvisionedThroughput,
    }));
  }

  return schema;
}
