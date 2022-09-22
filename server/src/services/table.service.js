import AWS from "../config/aws";

export async function all() {
  const tables = [];
  const params = {};

  do {
    const response = await AWS.dynamodb.listTables(params);
    tables.push(...response.TableNames);
    params.LastEvaluatedTableName = response.ExclusiveStartTableName;
  } while (params.LastEvaluatedTableName);

  return tables;
}

export async function create(params) {
  const response = await AWS.dynamodb.createTable(params);

  return response;
}

export async function describe(tableName) {
  const response = await AWS.dynamodb.describeTable({
    TableName: tableName,
  });

  return response;
}

export async function destroy(tableName) {
  const response = await AWS.dynamodb.deleteTable({
    TableName: tableName,
  });

  return response;
}

export async function update(tableName, params) {
  const response = await AWS.dynamodb.updateTable({
    TableName: tableName,
    ...params,
  });

  return response;
}
