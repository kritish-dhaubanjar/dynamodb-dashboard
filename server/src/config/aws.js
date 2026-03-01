import path from "path";
import http from "http";
import https from "https";
import { Worker } from "worker_threads";

import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { NodeHttpHandler } from "@smithy/node-http-handler";

import config from "../constants/config";
import { DynamoDBStreams } from "@aws-sdk/client-dynamodb-streams";

export class AWS {
  /**
   * @param {object} param
   * @param {DynamoDB} param.dynamodb
   */
  initializeFromDynamoDB({ dynamodb }) {
    this.dynamodb = dynamodb;
    this.document = DynamoDBDocument.from(this.dynamodb);
  }

  configuration() {
    const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 256 });
    const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 256 });

    const requestHandler = new NodeHttpHandler({ httpsAgent, httpAgent, socketAcquisitionWarningTimeout: 10_000 });

    const configuration = {
      logger: null,
      requestHandler,
    };

    if (this.AWS_REGION) {
      configuration.region = this.AWS_REGION;
    }

    if (this.AWS_ENDPOINT) {
      configuration.endpoint = this.AWS_ENDPOINT;
    }

    if ([this.AWS_ACCESS_KEY_ID, this.AWS_SECRET_ACCESS_KEY, this.AWS_SESSION_TOKEN].some(Boolean)) {
      configuration.credentials = {};
    }

    if (this.AWS_ACCESS_KEY_ID) {
      configuration.credentials.accessKeyId = this.AWS_ACCESS_KEY_ID;
    }

    if (this.AWS_SECRET_ACCESS_KEY) {
      configuration.credentials.secretAccessKey = this.AWS_SECRET_ACCESS_KEY;
    }

    if (this.AWS_SESSION_TOKEN) {
      configuration.credentials.sessionToken = this.AWS_SESSION_TOKEN;
    }

    return configuration;
  }

  /**
   * @param {object} param
   * @param {string} param.AWS_REGION
   * @param {string} param.AWS_ENDPOINT
   * @param {string} param.AWS_ACCESS_KEY_ID
   * @param {string} param.AWS_SECRET_ACCESS_KEY
   * @param {string|undefined} param.AWS_SESSION_TOKEN
   */
  initialize({
    AWS_REGION = config.aws.region,
    AWS_ENDPOINT = config.aws.endpoint,
    AWS_ACCESS_KEY_ID = config.aws.credentials.accessKeyId,
    AWS_SESSION_TOKEN = config.aws.credentials.sessionToken,
    AWS_SECRET_ACCESS_KEY = config.aws.credentials.secretAccessKey,
  } = {}) {
    this.AWS_REGION = AWS_REGION;
    this.AWS_ENDPOINT = AWS_ENDPOINT;
    this.AWS_ACCESS_KEY_ID = AWS_ACCESS_KEY_ID;
    this.AWS_SESSION_TOKEN = AWS_SESSION_TOKEN;
    this.AWS_SECRET_ACCESS_KEY = AWS_SECRET_ACCESS_KEY;

    const configuration = this.configuration();

    this.dynamodb = new DynamoDB(configuration);
    this.dynamodbStreams = new DynamoDBStreams(configuration);

    this.document = DynamoDBDocument.from(this.dynamodb);
  }

  initializeStreams() {
    const configuration = this.configuration();

    const workerjs = path.resolve(__dirname, "../workers/stream/index.js");

    new Worker(workerjs, {
      workerData: {
        region: configuration.region,
        endpoint: configuration.endpoint,
        credentials: configuration.credentials,
      },
    });
  }
}

export default new AWS();
