import { toNodeHandler } from "@modelcontextprotocol/node";
import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";

import TableTools from "./tools/table.tools";
import ItemTools from "./tools/item.tools";

const handler = createMcpHandler(() => {
  const server = new McpServer({ name: "dynamodb-dashboard", version: "1.0.0" });

  TableTools.register(server);
  ItemTools.register(server);

  return server;
});

export default (req, res) => toNodeHandler(handler)(req, res, req.body);
