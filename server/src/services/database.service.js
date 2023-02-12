import { AWS } from "../config/aws";
import { EVENTS } from "../constants/event";
import { OPERATIONS } from "../constants/dynamodb";
import { constructSchema } from "../utils/dynamodb";

import SocketService from "./socket.service";
import ItemServiceProvider from "./item.service";
import TableServiceProvider from "./table.service";

export default class DatabaseServiceProvider {
  constructor(_AWS_, credentials) {
    this.io = SocketService.io;

    // TARGET
    this.TARGET = {
      AWS: _AWS_,
      ItemService: new ItemServiceProvider(_AWS_),
      TableService: new TableServiceProvider(_AWS_),
    };

    // SOURCE
    this.SOURCE = {};
    this.SOURCE.AWS = new AWS();
    this.SOURCE.AWS.initialize(credentials);
    this.SOURCE.ItemService = new ItemServiceProvider(this.SOURCE.AWS);
    this.SOURCE.TableService = new TableServiceProvider(this.SOURCE.AWS);
  }

  async all() {
    const tables = await this.SOURCE.TableService.all();

    return tables;
  }

  async restore(tableNames) {
    await Promise.all(tableNames.map(async (tableName) => {
      try {
        const { Table } = await this.SOURCE.TableService.describe(tableName);
        await Promise.allSettled([this.TARGET.TableService.destroy(tableName)]);
        await this.TARGET.TableService.create(constructSchema(Table));

        const params = { Limit: 100 };
        const schema = Table.KeySchema.map(({ AttributeName }) => AttributeName);

        do {
          const response = await this.SOURCE.ItemService.fetch(OPERATIONS.SCAN, tableName, params);

          const { Items = [], LastEvaluatedKey = null } = response;
          await Promise.all(Items.map(item => this.TARGET.ItemService.create(tableName, schema, item)));

          params.ExclusiveStartKey = LastEvaluatedKey;
        } while (params.ExclusiveStartKey);

        // SUCCESS
        this.io.emit(EVENTS.SUCCESS, { tableName });
      } catch (error) {
        // ERROR
        this.io.emit(EVENTS.FAILED, { tableName });
        console.error(error);
      }
    }));

    return tableNames;
  }
}
