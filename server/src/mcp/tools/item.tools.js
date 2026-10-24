import * as z from "zod/v4";

import axios from "../config/axios";
import routes from "../config/routes";
import { interpolate } from "../../utils/string";

/**
 * Tool definitions for managing and inspecting database table items via the MCP server.
 */
export default class ItemTools {
  /**
   * Registers all table-item-related inspection and management tools to the MCP server.
   */
  static register(server) {
    // 1. Get Item by Key
    server.registerTool(
      "item.get",
      {
        title: "Get Item from Table by Key",
        description: "Retrieves a specific database item from a given table using its primary key attributes.",
        inputSchema: z.object({
          TableName: z.string().describe("The exact, case-sensitive name of the database table containing the item."),
          Key: z
            .record(z.string(), z.any())
            .refine((schema) => Object.keys(schema).length <= 2, {
              message: "Key can contain a maximum of 2 attributes (e.g., partition key and sort key).",
            })
            .describe("The primary key object identifying the item to retrieve."),
        }),
        annotations: {
          readOnlyHint: true,
        },
      },
      async ({ TableName, Key }) => {
        const url = interpolate(routes.ITEM.GET, { tableName: TableName });

        const { data } = await axios.post(url, Key);

        return {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: data,
        };
      },
    );

    // 2. Scan Items
    server.registerTool(
      "item.scan",
      {
        title: "Scan DynamoDB Table",
        description:
          "Performs a full scan on a DynamoDB table or secondary index to retrieve items, with support for filtering expressions and pagination limits.",
        annotations: {
          readOnlyHint: true,
        },
        inputSchema: z
          .object({
            TableName: z.string().describe("The name of the table to scan."),

            Limit: z.number().positive("Limit must be greater than 0").default(50),

            IndexName: z.string().optional().describe("The name of a secondary index to scan."),

            ExclusiveStartKey: z
              .record(z.string(), z.any())
              .refine((schema) => Object.keys(schema).length <= 2, {
                message: "ExclusiveStartKey can contain a maximum of 2 attributes (e.g., partition key and sort key).",
              })
              .optional()
              .describe("Primary key of the first item that this operation will evaluate."),

            FilterExpression: z.string().optional().describe("A string that narrows down the scan results."),

            ExpressionAttributeNames: z
              .record(z.string(), z.string())
              .optional()
              .describe("One or more substitution tokens for attribute names."),

            ExpressionAttributeValues: z
              .record(z.string(), z.any())
              .optional()
              .describe("Values that can be substituted in an expression."),
          })
          .superRefine((data, ctx) => {
            if (data.FilterExpression) {
              if (!data.ExpressionAttributeNames) {
                ctx.addIssue({
                  code: "custom",
                  message: "ExpressionAttributeNames is required when FilterExpression is present.",
                  path: ["ExpressionAttributeNames"],
                });
              }
            } else {
              if (data.ExpressionAttributeNames !== undefined) {
                ctx.addIssue({
                  code: "custom",
                  message: "ExpressionAttributeNames is forbidden when FilterExpression is not present.",
                  path: ["ExpressionAttributeNames"],
                });
              }
            }
          }),
        outputSchema: z
          .object({
            Items: z
              .array(z.record(z.string(), z.any()))
              .describe("An array of item data objects matched by the scan."),
            Count: z.number().describe("Number of items in the response."),
            ScannedCount: z.number().describe("Number of items evaluated before filtering."),
            LastEvaluatedKey: z
              .record(z.string(), z.any())
              .optional()
              .describe("Primary key of the last item evaluated, used for pagination."),
          })
          .describe("The result set from the table scan."),
      },
      async ({
        TableName,
        Limit,
        IndexName,
        FilterExpression,
        ExpressionAttributeNames,
        ExclusiveStartKey,
        ExpressionAttributeValues,
      }) => {
        const url = interpolate(routes.ITEM.SCAN, { tableName: TableName });

        const body = Object.fromEntries(
          Object.entries({
            Limit,
            IndexName,
            FilterExpression,
            ExclusiveStartKey,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
          }).filter(([_, v]) => v !== undefined),
        );

        const { data } = await axios.post(url, body);

        return {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: data,
        };
      },
    );

    // 3. Query Items
    server.registerTool(
      "item.query",
      {
        title: "Query DynamoDB Table",
        description:
          "Performs a key-based query on a DynamoDB table or secondary index to retrieve items efficiently, with support for key conditions, filtering expressions, and pagination limits.",
        annotations: {
          readOnlyHint: true,
        },
        inputSchema: z.object({
          TableName: z.string().describe("The name of the table to query."),

          Limit: z.number().positive("Limit must be greater than 0").default(50),

          IndexName: z.string().optional().describe("The name of a secondary index to query."),

          ExclusiveStartKey: z
            .record(z.string(), z.any())
            .refine((schema) => Object.keys(schema).length <= 2, {
              message: "ExclusiveStartKey can contain a maximum of 2 attributes (partition key and sort key).",
            })
            .optional()
            .describe("Primary key of the first item that this operation will evaluate."),

          KeyConditionExpression: z
            .string()
            .describe("A string that narrows down the query results by specifying the search criteria."),

          FilterExpression: z
            .string()
            .optional()
            .describe("A string that narrows down the query results after evaluation."),

          ExpressionAttributeNames: z
            .record(z.string(), z.string())
            .describe("One or more substitution tokens for attribute names."),

          ExpressionAttributeValues: z
            .record(z.string(), z.any())
            .optional()
            .describe("Values that can be substituted in an expression."),

          ScanIndexForward: z
            .boolean()
            .optional()
            .describe("Specifies the order of index traversal: true for ascending, false for descending."),
        }),
        outputSchema: z
          .object({
            Items: z
              .array(z.record(z.string(), z.any()))
              .describe("An array of item data objects matched by the scan."),
            Count: z.number().describe("Number of items in the response."),
            ScannedCount: z.number().describe("Number of items evaluated before filtering."),
            LastEvaluatedKey: z
              .record(z.string(), z.any())
              .optional()
              .describe("Primary key of the last item evaluated, used for pagination."),
          })
          .describe("The result set from the table scan."),
      },
      async ({
        TableName,
        Limit,
        IndexName,
        ScanIndexForward,
        KeyConditionExpression,
        FilterExpression,
        ExpressionAttributeNames,
        ExclusiveStartKey,
        ExpressionAttributeValues,
      }) => {
        const url = interpolate(routes.ITEM.QUERY, { tableName: TableName });

        const body = Object.fromEntries(
          Object.entries({
            Limit,
            IndexName,
            FilterExpression,
            ScanIndexForward,
            ExclusiveStartKey,
            KeyConditionExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
          }).filter(([_, v]) => v !== undefined),
        );

        const { data } = await axios.post(url, body);

        return {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: data,
        };
      },
    );

    // 3. Count Items
    server.registerTool(
      "item.count",
      {
        title: "Count DynamoDB Table Items",
        description:
          "Counts the number of items matching specific key conditions or filter expressions in a DynamoDB table or secondary index, without returning the actual item data.",
        annotations: {
          readOnlyHint: true,
        },
        inputSchema: z
          .object({
            TableName: z.string().describe("The name of the table to count items from."),

            IndexName: z.string().optional().describe("The name of a secondary index to query."),

            ExclusiveStartKey: z
              .record(z.string(), z.any())
              .refine((schema) => Object.keys(schema).length <= 2, {
                message: "ExclusiveStartKey can contain a maximum of 2 attributes (partition key and sort key).",
              })
              .optional()
              .describe("Primary key of the first item that this operation will evaluate."),

            KeyConditionExpression: z
              .string()
              .optional()
              .describe("A string that narrows down the query results by specifying the search criteria."),

            FilterExpression: z
              .string()
              .optional()
              .describe("A string that narrows down the query results after evaluation."),

            ExpressionAttributeNames: z
              .record(z.string(), z.string())
              .describe("One or more substitution tokens for attribute names."),

            ExpressionAttributeValues: z
              .record(z.string(), z.any())
              .optional()
              .describe("Values that can be substituted in an expression."),

            ScanIndexForward: z
              .boolean()
              .optional()
              .describe("Specifies the order of index traversal: true for ascending, false for descending."),
          })
          .superRefine((data, ctx) => {
            if (data.FilterExpression || data.KeyConditionExpression) {
              if (!data.ExpressionAttributeNames) {
                ctx.addIssue({
                  code: "custom",
                  message:
                    "ExpressionAttributeNames is required when either FilterExpression or KeyConditionExpression is present.",
                  path: ["ExpressionAttributeNames"],
                });
              }
            } else {
              if (data.ExpressionAttributeNames !== undefined) {
                ctx.addIssue({
                  code: "custom",
                  message:
                    "ExpressionAttributeNames is forbidden when neither FilterExpression nor KeyConditionExpression is present.",
                  path: ["ExpressionAttributeNames"],
                });
              }
            }
          }),
        outputSchema: z
          .object({
            Count: z.number().describe("Number of items in the response."),
            ScannedCount: z.number().describe("Number of items evaluated before filtering."),
          })
          .describe("The result set from the table scan."),
      },
      async ({
        TableName,
        IndexName,
        ScanIndexForward,
        KeyConditionExpression,
        FilterExpression,
        ExpressionAttributeNames,
        ExclusiveStartKey,
        ExpressionAttributeValues,
      }) => {
        const url = interpolate(routes.ITEM.COUNT, { tableName: TableName });

        const body = Object.fromEntries(
          Object.entries({
            IndexName,
            FilterExpression,
            ScanIndexForward,
            ExclusiveStartKey,
            KeyConditionExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
          }).filter(([_, v]) => v !== undefined),
        );

        const { data } = await axios.post(url, body);

        return {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: data,
        };
      },
    );
  }
}
