import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import config from "../constants/config";

export class AWS {
  /**
   * @param {object} param
   * @param {DynamoDB} param.dynamodb
   */
  initializeFromDynamoDB({ dynamodb }) {
    this.dynamodb = dynamodb;
    this.document = DynamoDBDocument.from(this.dynamodb);
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

    this.dynamodb = new DynamoDB({
      region: AWS_REGION,
      endpoint: AWS_ENDPOINT,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
        ...(AWS_SESSION_TOKEN && { sessionToken: AWS_SESSION_TOKEN }),
      },
      logger: null,
    });

    this.document = DynamoDBDocument.from(this.dynamodb);
  }
}

export default new AWS();
