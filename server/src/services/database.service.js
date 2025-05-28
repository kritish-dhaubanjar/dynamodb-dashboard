import { AWS } from "../config/aws";
import EVENTS from "../constants/event";

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
  static async update(credentials) {
    const { default: AWSConfig } = await import("../config/aws");
    AWSConfig.initialize(credentials);
  }

  static async reset() {
    const { default: AWSConfig } = await import("../config/aws");
    AWSConfig.initialize();
  }

  /**
   * @returns {Promise<Array<string>>}
   */
  async all() {
    const tables = await this.SOURCE.TableService.all();

    return tables;
  }

  /**
   * @param {Array<{source: string, target: string}>} tables
   * @param {string} uid
   * @param {EventEmitter} eventEmitter
   *
   * @returns {Array<string>}
   */
  restore(uid, eventEmitter, tables = []) {
    const queue = [...tables];
    const jobs = queue.splice(0, POOL_SIZE);
    let counter = jobs.length;

    const run = async ({ source, target }) => {
      const tableName = source;
      try {
        eventEmitter.emit(EVENTS.BEGIN, uid, tableName);

        const restore = TableServiceProvider.restore(tableName, target, this);

        // eslint-disable-next-line no-restricted-syntax
        for await (const [ItemCount, TotalItemCount] of restore) {
          eventEmitter.emit(EVENTS.PROGRESS, uid, { tableName, data: [ItemCount, TotalItemCount] });
        }

        eventEmitter.emit(EVENTS.SUCCESS, uid, tableName);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
        eventEmitter.emit(EVENTS.FAILURE, uid, tableName);
      }

      eventEmitter.emit(EVENTS.END, uid, tableName);
    };

    eventEmitter.on(EVENTS.END, () => {
      if (queue.length) {
        const job = queue.shift();
        run(job);
        return;
      }

      counter -= 1;
      if (counter === 0) {
        eventEmitter.emit(EVENTS.CLOSE, uid);
      }
    });

    jobs.map(run);

    return tables;
  }

  /*
   * @param {string} sourceTableName
   * @param {string} targetTableName
   * @return {Promise<Array<number>>}
   */
  async compare(sourceTableName, targetTableName) {
    const [{ Table: TargetTable }, { Table: SourceTable }] = await Promise.all([
      this.TARGET.TableService.describe(targetTableName),
      this.SOURCE.TableService.describe(sourceTableName),
    ]);

    const { ItemCount } = TargetTable;
    const { ItemCount: TotalItemCount } = SourceTable;

    return [ItemCount, TotalItemCount];
  }
}
