import AWS from "../config/aws";
import { OPERATIONS } from "../constants/dynamodb";
import { constructSchema } from "../utils/dynamodb";
import DatabaseServiceProvider from "./database.service";
import { waitUntilTableExists, waitUntilTableNotExists } from "@aws-sdk/client-dynamodb";

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
  async create(params, options = {}) {
    const response = await this.AWS.dynamodb.createTable(params, options);

    return response;
  }

  /**
   * @param {object} params
   *
   * @returns {Promise<object>}
   */
  async describe(tableName, options) {
    const response = await this.AWS.dynamodb.describeTable(
      {
        TableName: tableName,
      },
      options,
    );

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
  async destroy(tableName, options = {}) {
    const response = await this.AWS.dynamodb.deleteTable(
      {
        TableName: tableName,
      },
      options,
    );

    return response;
  }

  /**
   * @param {string} tableName
   *
   * @returns {Promise<object>}
   */
  async truncate(tableName) {
    const response = await this.describe(tableName);

    await this.destroy(tableName);
    await this.create(constructSchema(response.Table));

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
   * @param {string} sourceTableName
   * @param {string} targetTableName
   * @param {DatabaseServiceProvider} DatabaseServiceProvider
   *
   * @returns {Promise}
   */
  static async *restore(sourceTableName, targetTableName, DatabaseServiceProvider, AbortController) {
    const abortSignal = AbortController.signal;

    const { Table } = await DatabaseServiceProvider.SOURCE.TableService.describe(sourceTableName, { abortSignal });

    await Promise.allSettled([
      DatabaseServiceProvider.TARGET.TableService.destroy(targetTableName, { abortSignal }),
      waitUntilTableNotExists(
        { client: DatabaseServiceProvider.TARGET.AWS.dynamodb, maxWaitTime: 60, abortSignal, maxDelay: 5, minDelay: 1 },
        { TableName: targetTableName },
      ),
    ]);

    await Promise.allSettled([
      DatabaseServiceProvider.TARGET.TableService.create(
        { ...constructSchema(Table), TableName: targetTableName },
        { abortSignal },
      ),
      waitUntilTableExists(
        {
          client: DatabaseServiceProvider.TARGET.AWS.dynamodb,
          maxWaitTime: 60,
          abortSignal: abortSignal,
          maxDelay: 5,
          minDelay: 1,
        },
        { TableName: targetTableName },
      ),
    ]);

    const params = { Limit: 500 };
    const schema = Table.KeySchema.map(({ AttributeName }) => AttributeName);

    let restoredItemCount = 0;

    do {
      // eslint-disable-next-line no-await-in-loop
      const response = await DatabaseServiceProvider.SOURCE.ItemService.fetch(
        OPERATIONS.SCAN,
        sourceTableName,
        params,
        { abortSignal },
      );

      const { Items = [], LastEvaluatedKey = null } = response;
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(
        Items.map((item) =>
          DatabaseServiceProvider.TARGET.ItemService.create(targetTableName, schema, item, { abortSignal }),
        ),
      );

      restoredItemCount += Items.length;

      const [ItemCount, TotalItemCount] = await DatabaseServiceProvider.compare(sourceTableName, targetTableName);

      yield [ItemCount || restoredItemCount, TotalItemCount];

      params.ExclusiveStartKey = LastEvaluatedKey;
    } while (params.ExclusiveStartKey);
  }
}
