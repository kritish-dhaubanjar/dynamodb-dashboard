import AWS from "../config/aws";
import { OPERATIONS } from "../constants/dynamodb";
import { constructSchema } from "../utils/dynamodb";
import DatabaseServiceProvider from "./database.service";
import { waitUntilTableExists } from "@aws-sdk/client-dynamodb";

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
  async describeTimeToLive(tableName) {
    const response = await this.AWS.dynamodb.describeTimeToLive({
      TableName: tableName,
    });

    return response;
  }

  /**
   * @param {string} tableName
   *
   * @returns {Promise<object>}
   */
  async disableTimeToLive(tableName) {
    let response = await this.AWS.dynamodb.describeTimeToLive({ TableName: tableName });

    if (response.TimeToLiveDescription.AttributeName) {
      response = await this.AWS.dynamodb.updateTimeToLive({
        TableName: tableName,
        TimeToLiveSpecification: {
          Enabled: false,
          AttributeName: response.TimeToLiveDescription.AttributeName,
        },
      });
    }

    return response;
  }

  /**
   * @param {string} tableName
   * @param {object} params
   *
   * @returns {Promise<object>}
   */
  async updateTimeToLive(tableName, params) {
    const response = await this.AWS.dynamodb.updateTimeToLive({
      TableName: tableName,
      ...params,
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
    await Promise.allSettled([DatabaseServiceProvider.TARGET.TableService.create(constructSchema(Table))]);

    await waitUntilTableExists(
      { client: DatabaseServiceProvider.TARGET.AWS.dynamodb, maxWaitTime: 60 },
      { TableName: tableName },
    );

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
