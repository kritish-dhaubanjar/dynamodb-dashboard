import { chunk, pick } from "lodash";

import AWS from "../config/aws";
import { deserialize, serialize } from "../utils/dynamodb";

export default class ItemServiceProvider {
  constructor(_AWS_ = AWS) {
    this.AWS = _AWS_;
  }

  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html
  /**
   *
   * @param {*} operation
   * @param {*} tableName
   * @param {*} conditions
   * @returns
   */
  async fetch(operation, tableName, conditions) {
    const params = {
      TableName: tableName,
      ...conditions,
    };

    const items = [];
    let scannedCount = 0;

    // Slice
    let intermediateExclusiveStartKey = params.ExclusiveStartKey;

    do {
      // eslint-disable-next-line no-await-in-loop
      const response = await this.AWS.document[operation](params); // AWS.document.scan(...), AWS.document.query(...)
      scannedCount += response.ScannedCount;

      items.push(...response.Items);
      params.ExclusiveStartKey = response.LastEvaluatedKey;

      // Slice
      intermediateExclusiveStartKey ||= response.LastEvaluatedKey;

      if (items.length >= params.Limit) break;
    } while (params.ExclusiveStartKey);

    /* Slice
     * eg:
     * Limit = 10
     * intermediateExclusiveStartKey = g
     * items = [...[a,b,c,d,e,f,g], ...[h,i,j,k,l]]
     * slice = [a,b,c,d,e,f,g,h,i,j]
     * ExclusiveStartKey = pick(j, Object.keys(g))
     */
    const slice = items.slice(0, params.Limit);

    if (items.length > slice.length) {
      const item = slice.at(-1);
      const indices = Object.keys(intermediateExclusiveStartKey);

      params.ExclusiveStartKey = pick(item, indices);
    }

    return {
      Items: slice.map((item) => serialize(item)),
      Count: slice.length,
      ScannedCount: scannedCount,
      LastEvaluatedKey: params.ExclusiveStartKey,
    };
  }

  /**
   *
   * @param {*} tableName
   * @param {*} keys
   * @returns
   */
  async get(tableName, keys) {
    const params = {
      TableName: tableName,
      Key: keys,
    };

    const response = await this.AWS.document.get(params);

    response.Item = serialize(response.Item);

    return response;
  }

  /**
   * A single call to BatchWriteItem can transmit up to 16MB of data over the network, consisting of up to 25 item put or delete operations.
   *
   * @param {*} tableName
   * @param {*} items
   * @returns
   */
  async destroy(tableName, items) {
    const chunks = chunk(items, 25);

    const requests = chunks.map((chunkedItem) => ({
      RequestItems: {
        [tableName]: chunkedItem,
      },
    }));

    const response = await Promise.all(requests.map(this.AWS.document.batchWrite.bind(this.AWS.document)));

    return response;
  }

  /**
   *
   * @param {*} tableName
   * @param {*} schema
   * @param {*} data
   * @returns
   */
  async create(tableName, schema, body) {
    const params = {
      Item: body,
      TableName: tableName,
      ConditionExpression: schema.map((key) => `attribute_not_exists(${key})`).join(" AND "),
    };

    const response = await this.AWS.document.put(params);

    return response;
  }

  /**
   *
   * @param {*} tableName
   * @param {*} schema
   * @param {*} param
   * @returns
   */
  async update(tableName, schema, { ref, body }) {
    const { Item } = await this.AWS.document.get({
      Key: ref,
      TableName: tableName,
    });

    const params = {
      Key: ref,
      TableName: tableName,
      Item: deserialize(Item, body),
      ConditionExpression: schema.map((key) => `attribute_exists(${key})`).join(" AND "),
    };

    const response = await this.AWS.document.put(params);

    return response;
  }

  /**
   * @param {*} tableName
   * @param {*} schema
   * @param {*} param
   * @returns
   */
  async transactUpdate(tableName, schema, { ref, body }) {
    const { Item } = await this.AWS.document.get({
      TableName: tableName,
      Key: ref,
    });

    const response = this.AWS.document.transactWrite({
      TransactItems: [
        {
          Delete: {
            Key: ref,
            TableName: tableName,
          },
        },
        {
          Put: {
            Item: deserialize(Item, body),
            TableName: tableName,
            Key: pick(body, schema),
            ConditionExpression: schema.map((key) => `attribute_not_exists(${key})`).join(" AND "),
          },
        },
      ],
    });

    return response;
  }
}
