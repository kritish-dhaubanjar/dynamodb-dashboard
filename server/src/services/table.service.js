import AWS from "../config/aws";
import { OPERATIONS } from "../constants/dynamodb";
import { constructSchema } from "../utils/dynamodb";

export default class TableServiceProvider {
  constructor(_AWS_ = AWS) {
    this.AWS = _AWS_;
  }

  async all() {
    const tables = [];
    const params = {};

    do {
      // eslint-disable-next-line no-await-in-loop
      const response = await this.AWS.dynamodb.listTables(params);
      tables.push(...response.TableNames);
      params.ExclusiveStartTableName = response.LastEvaluatedTableName;
    } while (params.ExclusiveStartTableName);

    return tables;
  }

  async create(params) {
    const response = await this.AWS.dynamodb.createTable(params);

    return response;
  }

  async describe(tableName) {
    const response = await this.AWS.dynamodb.describeTable({
      TableName: tableName,
    });

    return response;
  }

  async destroy(tableName) {
    const response = await this.AWS.dynamodb.deleteTable({
      TableName: tableName,
    });

    return response;
  }

  async update(tableName, params) {
    const response = await this.AWS.dynamodb.updateTable({
      TableName: tableName,
      ...params,
    });

    return response;
  }

  static async restore(tableName, DatabaseServiceProvider) {
    const { Table } = await DatabaseServiceProvider.SOURCE.TableService.describe(tableName);

    await Promise.allSettled([DatabaseServiceProvider.TARGET.TableService.destroy(tableName)]);
    await DatabaseServiceProvider.TARGET.TableService.create(constructSchema(Table));

    const params = { Limit: 100 };
    const schema = Table.KeySchema.map(({ AttributeName }) => AttributeName);

    do {
      // eslint-disable-next-line no-await-in-loop
      const response = await DatabaseServiceProvider.SOURCE.ItemService.fetch(OPERATIONS.SCAN, tableName, params);

      const { Items = [], LastEvaluatedKey = null } = response;
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(
        Items.map((item) => DatabaseServiceProvider.TARGET.ItemService.create(tableName, schema, item)),
      );

      params.ExclusiveStartKey = LastEvaluatedKey;
    } while (params.ExclusiveStartKey);
  }
}
