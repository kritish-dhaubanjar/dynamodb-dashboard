import { AWS } from "../config/aws";
import { EVENTS } from "../constants/event";

import ItemServiceProvider from "./item.service";
import TableServiceProvider from "./table.service";
import { POOL_SIZE } from "../constants/dynamodb";

export default class DatabaseServiceProvider {
  /**
   * @param {AWS} _AWS_
   * @param {object} credentials
   */
  constructor(_AWS_, credentials) {
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

  /**
   * @param {object} credentials
   */
  async update(credentials) {
    const { default: AWS } = await import("../config/aws");
    AWS.initialize(credentials);
  }

  async reset() {
    const { default: AWS } = await import("../config/aws");
    AWS.initialize();
  }

  /**
   * @returns {Promise<Array<string>>}
   */
  async all() {
    const tables = await this.SOURCE.TableService.all();

    return tables;
  }

  /**
   * @param {Array<string>} tableNames
   * @param {string} uid
   * @param {EventEmitter} eventEmitter
   *
   * @returns {Array<string>}
   */
  restore(tableNames = [], uid, eventEmitter) {
    const queue = [...tableNames];
    const jobs = queue.splice(0, POOL_SIZE);
    let counter = jobs.length;

    eventEmitter.on(EVENTS.END, () => {
      if (queue.length) {
        const job = queue.shift();
        run(job);
        return;
      }

      if (--counter === 0) {
        eventEmitter.emit(EVENTS.CLOSE, uid);
      }
    });

    const run = async (tableName) => {
      try {
        eventEmitter.emit(EVENTS.BEGIN, uid, { tableName });

        const restore = TableServiceProvider.restore(tableName, this);

        for await (const [ItemCount, TotalItemCount] of restore) {
          eventEmitter.emit(EVENTS.PROGRESS, uid, { tableName, data: [ItemCount, TotalItemCount] });
        }

        eventEmitter.emit(EVENTS.SUCCESS, uid, { tableName });
      } catch (error) {
        eventEmitter.emit(EVENTS.FAILURE, uid, { tableName, error });
        console.error(error);
      } finally {
        eventEmitter.emit(EVENTS.END, uid, { tableName });
      }
    };

    jobs.map(run);

    return tableNames;
  }

  /*
   * @param {string} tableName
   * @return {Promise<Array<number>>}
   */
  async compare(tableName) {
    const [{ Table: TargetTable }, { Table: SourceTable }] = await Promise.all([
      this.TARGET.TableService.describe(tableName),
      this.SOURCE.TableService.describe(tableName),
    ]);

    const ItemCount = TargetTable.ItemCount;
    const TotalItemCount = SourceTable.ItemCount;

    return [ItemCount, TotalItemCount];
  }
}
