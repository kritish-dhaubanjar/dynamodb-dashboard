#!/usr/bin/env node
import server from "./server";
import { Command } from "commander";
import { version } from "../../package.json";

const program = new Command();

program.name("dynamodb-dashboard").description("GUI Dashboard for local or remote DynamoDB").version(version);

program
  .command("start")
  .option("-d, --debug", "show log output for running app", false)
  .option("-o, --open", "open http://<host>:<port>/<prefix>", false)
  .option("-p, --port <port>", "port to run app", 4567)
  .option("-h, --host <host>", "host to run app", "0.0.0.0")
  .option("--prefix <prefix>", "prefix of route URIs (depends on 'app' build arg)", "dynamodb")
  .action(server);

program.parse();
