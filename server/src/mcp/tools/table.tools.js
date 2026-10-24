import * as z from "zod/v4";

import axios from "../config/axios";
import routes from "../config/routes";
import { interpolate } from "../../utils/string";

/**
 * Tool definitions for managing and inspecting database tables via the MCP server.
 */
export default class TableTools {
  /**
   * Registers all table-related inspection and management tools to the MCP server.
   */
  static register(server) {
    // 1. List Tables
    server.registerTool(
      "table.index",
      {
        title: "List All Tables",
        description: "Retrieves a comprehensive list of all available database table names in the system.",
        outputSchema: z.array(z.string()).describe("An array of table names."),
        annotations: {
          readOnlyHint: true,
        },
      },
      async () => {
        const url = routes.TABLE.INDEX;
        const { data } = await axios.get(url);

        return {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: data,
        };
      },
    );

    // 2. Describe Table
    server.registerTool(
      "table.describe",
      {
        title: "Describe Table Schema",
        description: "Retrieves detailed schema metadata, columns, and properties for a specific database table.",
        inputSchema: z.object({
          tableName: z.string().describe("The exact, case-sensitive name of the database table to inspect."),
        }),
        annotations: {
          readOnlyHint: true,
        },
      },
      async ({ tableName }) => {
        const url = interpolate(routes.TABLE.DESCRIBE, { tableName });

        const { data } = await axios.get(url);

        return {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: data,
        };
      },
    );

    // 3. Describe Table Time To Live (TTL)
    server.registerTool(
      "table.describeTimeToLive",
      {
        title: "Describe Table Time To Live (TTL)",
        description:
          "Retrieves the Time-To-Live (TTL) expiration configuration and active status for a specified table.",
        inputSchema: z.object({
          tableName: z.string().describe("The exact name of the database table to check TTL configuration for."),
        }),
        annotations: {
          readOnlyHint: true,
        },
      },
      async ({ tableName }) => {
        const url = interpolate(routes.TABLE.DESCRIBE_TTL, { tableName });

        const { data } = await axios.get(url);

        return {
          content: [{ type: "text", text: JSON.stringify(data) }],
          structuredContent: data,
        };
      },
    );
  }
}
