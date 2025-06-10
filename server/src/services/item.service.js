import { chunk, fromPairs, pick } from "lodash";

import AWS from "../config/aws";
import { deserialize, serialize } from "../utils/dynamodb";
import { OPERATIONS } from "../constants/dynamodb";

export default class ItemServiceProvider {
  /**
   * @param {AWS} _AWS_
   */
  constructor(_AWS_ = AWS) {
    this.AWS = _AWS_;
  }

  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Scan.html
  // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html
  /**
   *
   * @param {"scan"|"query"} operation
   * @param {string} tableName
   * @param {object} conditions
   *
   * @returns {Promise<object>}
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
   * @param {string} tableName
   * @param {object} keys
   *
   * @returns {Promise<object>}
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
   * @param {string} tableName
   * @param {Array<object>} items
   *
   * @returns {Promise<Array<object>>}
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
   * @param {string} tableName
   * @param {object} conditions
   * @param {function} callback
   *
   * @returns {Promise<{ Count: number, ScannedCount: number }>}
   */
  async all(tableName, conditions, callback = async () => {}) {
    let count = 0;
    let scannedCount = 0;

    const params = {
      ...conditions,
      Limit: 10000,
      TableName: tableName,
    };

    const operation = Boolean(params.KeyConditionExpression) ? OPERATIONS.QUERY : OPERATIONS.SCAN;

    do {
      const response = await this.AWS.document[operation](params);

      await callback(tableName, response.Items);

      count += response.Items.length;
      scannedCount += response.ScannedCount;

      params.ExclusiveStartKey = response.LastEvaluatedKey;
    } while (params.ExclusiveStartKey);

    return { Count: count, ScannedCount: scannedCount };
  }

  /**
   * @param {string} tableName
   * @param {object} schema
   * @param {object} body
   *
   * @returns {Promise<object>}
   */
  async create(tableName, schema, body) {
    const params = {
      Item: body,
      TableName: tableName,
      ConditionExpression: schema.map((key) => `attribute_not_exists(#${key})`).join(" AND "),
      ExpressionAttributeNames: fromPairs(schema.map((key) => [`#${key}`, key])),
    };

    const response = await this.AWS.document.put(params);

    return response;
  }

  /**
   * @param {string} tableName
   * @param {object} schema
   * @param {{ ref: object, body: object }} param
   *
   * @returns {Promise<object>}
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
      ConditionExpression: schema.map((key) => `attribute_exists(#${key})`).join(" AND "),
      ExpressionAttributeNames: fromPairs(schema.map((key) => [`#${key}`, key])),
    };

    const response = await this.AWS.document.put(params);

    return response;
  }

  /**
   * @param {string} tableName
   * @param {object} schema
   * @param {{ ref: object, body: object }} param
   *
   * @returns {Promise<object>}
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
            ConditionExpression: schema.map((key) => `attribute_not_exists(#${key})`).join(" AND "),
            ExpressionAttributeNames: fromPairs(schema.map((key) => [`#${key}`, key])),
          },
        },
      ],
    });

    return response;
  }

  /**
   * @param {string} tableName
   * @param {object} conditions
   *
   * @returns {Promise<{ Count: number, ScannedCount: number }>}
   */
  async count(tableName, conditions) {
    const response = await this.all(tableName, conditions);

    return response;
  }

  /**
   * @param {string} tableName
   * @param {object} conditions
   *
   * @returns {Promise<{ Count: number, ScannedCount: number }>}
   */
  async truncate(tableName, schema, conditions) {
    const destroyer = async (tableName, items) => {
      const requests = items.map((item) => ({ DeleteRequest: { Key: pick(item, schema) } }));
      const response = await this.destroy(tableName, requests);

      return response;
    };

    const response = await this.all(tableName, conditions, destroyer);

    return response;
  }
}
