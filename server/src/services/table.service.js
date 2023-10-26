import AWS from "../config/aws";

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
}
