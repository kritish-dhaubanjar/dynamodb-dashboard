import { workerData } from "worker_threads";

import { AWS } from "../../config/aws.js";
import TableServiceProvider from "../../services/table.service.js";

class Stream {
  constructor(configuration) {
    this.AWS = new AWS();

    this.AWS.initialize({
      AWS_REGION: configuration.region,
      AWS_ENDPOINT: configuration.endpoint,
      AWS_ACCESS_KEY_ID: configuration.credentials.accessKeyId,
      AWS_SESSION_TOKEN: configuration.credentials.sessionToken,
      AWS_SECRET_ACCESS_KEY: configuration.credentials.secretAccessKey,
    });

    this.TableService = new TableServiceProvider(this.AWS);

    this.ShardIds = new Map();
  }

  async getLatestStreamArns() {
    const data = [];

    const tableNames = await this.TableService.all();

    for (const tableName of tableNames) {
      const { Table } = await this.TableService.describe(tableName);

      if (Table.LatestStreamArn) {
        data.push(Table.LatestStreamArn);
      }
    }

    return data;
  }

  async discoverShards(StreamArn) {
    while (true) {
      const {
        StreamDescription: { Shards },
      } = await this.AWS.dynamodbStreams.describeStream({ StreamArn });

      for (const Shard of Shards) {
        if (this.ShardIds.has(Shard.ShardId)) {
          continue;
        }

        this.ShardIds.set(Shard.ShardId, this.pollShard(StreamArn, Shard.ShardId));
      }

      this.sleep(10_000);
    }
  }

  async pollShard(StreamArn, ShardId) {
    try {
      const { ShardIterator } = await this.AWS.dynamodbStreams.getShardIterator({
        ShardId,
        StreamArn,
        ShardIteratorType: "LATEST",
      });

      let NextShardIterator = ShardIterator;

      while (NextShardIterator) {
        const response = await this.AWS.dynamodbStreams.getRecords({ ShardIterator: NextShardIterator, Limit: 100 });

        if (response.Records.length) {
          // TODO: handler
        }

        NextShardIterator = response.NextShardIterator;

        await this.sleep(1_000);
      }
    } finally {
      this.ShardIds.delete(ShardId);
    }
  }

  async initialize() {
    const streamArns = await this.getLatestStreamArns();

    streamArns.forEach((StreamArn) => this.discoverShards(StreamArn));
  }

  async sleep(milliseconds) {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
}

const stream = new Stream(workerData);

stream.initialize();
