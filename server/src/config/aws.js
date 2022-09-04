import config from "../constants/config";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

export const dynamodb = new DynamoDB(config.aws);
export const document = DynamoDBDocument.from(dynamodb);
