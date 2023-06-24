import AWS from "../config/aws";
import ItemServiceProvider from "./item.service";

import { OPERATIONS } from "../constants/dynamodb";
import { ForeignKeyTableSchema } from "../constants/foreign-key";

export default class ForeignKeyServiceProvider {
  constructor(_AWS_ = AWS) {
    this.ItemService = new ItemServiceProvider();
  }

  async fetch(tableName) {
    try {
      const condition = {
        KeyConditionExpression: '#tableName = :tableName',
        ExpressionAttributeNames: {
          "#tableName": "TableName",
        },
        ExpressionAttributeValues: {
          ":tableName": tableName
        }
      };

      const response = await this.ItemService.fetch(OPERATIONS.QUERY, ForeignKeyTableSchema.TableName, condition);

      return response.Items;
    } catch (error) { }
  }
}
