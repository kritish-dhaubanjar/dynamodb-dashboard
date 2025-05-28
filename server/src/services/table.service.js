import { waitUntilTableExists, waitUntilTableNotExists } from "@aws-sdk/client-dynamodb";
import AWS from "../config/aws";
import { OPERATIONS } from "../constants/dynamodb";
import { constructSchema } from "../utils/dynamodb";

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
  static async *restore(sourceTableName, targetTableName, databaseServiceProvider) {
    const { Table } = await databaseServiceProvider.SOURCE.TableService.describe(sourceTableName);

    await Promise.allSettled([
      databaseServiceProvider.TARGET.TableService.destroy(targetTableName),
      waitUntilTableNotExists(
        { client: databaseServiceProvider.TARGET.AWS.dynamodb, maxWaitTime: 60 },
        { TableName: targetTableName },
      ),
    ]);

    await Promise.allSettled([
      databaseServiceProvider.TARGET.TableService.create({ ...constructSchema(Table), TableName: targetTableName }),
      waitUntilTableExists(
        { client: databaseServiceProvider.TARGET.AWS.dynamodb, maxWaitTime: 60 },
        { TableName: targetTableName },
      ),
    ]);

    const params = { Limit: 100 };
    const schema = Table.KeySchema.map(({ AttributeName }) => AttributeName);

    do {
      // eslint-disable-next-line no-await-in-loop
      const response = await databaseServiceProvider.SOURCE.ItemService.fetch(OPERATIONS.SCAN, sourceTableName, params);

      const { Items = [], LastEvaluatedKey = null } = response;
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(
        Items.map((item) => databaseServiceProvider.TARGET.ItemService.create(targetTableName, schema, item)),
      );

      // eslint-disable-next-line no-await-in-loop
      yield await databaseServiceProvider.compare(sourceTableName, targetTableName);

      params.ExclusiveStartKey = LastEvaluatedKey;
    } while (params.ExclusiveStartKey);
  }
}
