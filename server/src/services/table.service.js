import AWS from "../config/aws";
import { OPERATIONS } from "../constants/dynamodb";
import { constructSchema } from "../utils/dynamodb";
import DatabaseServiceProvider from "./database.service";

export default class TableServiceProvider {
  /**
   * @param {AWS} _AWS_
   * @param {object} credentials
   */
  constructor(_AWS_ = AWS) {
    this.AWS = _AWS_;
  }

  /**
   * @returns {Promise<Array<object>>}
   */
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

  /**
   * @param {object} params
   *
   * @returns {Promise<object>}
   */
  async create(params) {
    const response = await this.AWS.dynamodb.createTable(params);

    return response;
  }

  /**
   * @param {object} params
   *
   * @returns {Promise<object>}
   */
  async describe(tableName) {
    const response = await this.AWS.dynamodb.describeTable({
      TableName: tableName,
    });

    return response;
  }

  /**
   * @param {string} tableName
   *
   * @returns {Promise<object>}
   */
  async destroy(tableName) {
    const response = await this.AWS.dynamodb.deleteTable({
      TableName: tableName,
    });

    return response;
  }

  /**
   * @param {string} tableName
   * @param {object} params
   *
   * @returns {Promise<object>}
   */
  async update(tableName, params) {
    const response = await this.AWS.dynamodb.updateTable({
      TableName: tableName,
      ...params,
    });

    return response;
  }

  /**
   * @param {string} tableName
   * @param {DatabaseServiceProvider} DatabaseServiceProvider
   *
   * @returns {Promise}
   */
  static async *restore(tableName, DatabaseServiceProvider) {
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

      yield await DatabaseServiceProvider.compare(tableName);

      params.ExclusiveStartKey = LastEvaluatedKey;
    } while (params.ExclusiveStartKey);
  }
}
