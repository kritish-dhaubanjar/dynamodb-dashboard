const DYNAMODB = {
  OPERATIONS: {
    SCAN: "SCAN",
    QUERY: "QUERY",
  },
};

export const TTL = {
  STATUS: {
    DISABLED: "DISABLED",
    ENABLED: "ENABLED",
  },
};

export const AWS_REGIONS = [
  "us-east-2",
  "us-east-1",
  "us-west-1",
  "us-west-2",
  "af-south-1",
  "ap-east-1",
  "ap-south-2",
  "ap-southeast-3",
  "ap-southeast-4",
  "ap-south-1",
  "ap-northeast-3",
  "ap-northeast-2",
  "ap-southeast-1",
  "ap-southeast-2",
  "ap-northeast-1",
  "ca-central-1",
  "eu-central-1",
  "eu-west-1",
  "eu-west-2",
  "eu-south-1",
  "eu-west-3",
  "eu-south-2",
  "eu-north-1",
  "eu-central-2",
  "il-central-1",
  "me-south-1",
  "me-central-1",
  "sa-east-1",
  "us-gov-east-1",
  "us-gov-west-1",
];

export const AWS_DYNAMODB_ENDPOINTS = [
  "https://dynamodb.us-east-2.amazonaws.com",
  "https://dynamodb.us-east-1.amazonaws.com",
  "https://dynamodb.us-west-1.amazonaws.com",
  "https://dynamodb.us-west-2.amazonaws.com",
  "https://dynamodb.af-south-1.amazonaws.com",
  "https://dynamodb.ap-east-1.amazonaws.com",
  "https://dynamodb.ap-south-2.amazonaws.com",
  "https://dynamodb.ap-southeast-3.amazonaws.com",
  "https://dynamodb.ap-southeast-4.amazonaws.com",
  "https://dynamodb.ap-south-1.amazonaws.com",
  "https://dynamodb.ap-northeast-3.amazonaws.com",
  "https://dynamodb.ap-northeast-2.amazonaws.com",
  "https://dynamodb.ap-southeast-1.amazonaws.com",
  "https://dynamodb.ap-southeast-2.amazonaws.com",
  "https://dynamodb.ap-northeast-1.amazonaws.com",
  "https://dynamodb.ca-central-1.amazonaws.com",
  "https://dynamodb.eu-central-1.amazonaws.com",
  "https://dynamodb.eu-west-1.amazonaws.com",
  "https://dynamodb.eu-west-2.amazonaws.com",
  "https://dynamodb.eu-south-1.amazonaws.com",
  "https://dynamodb.eu-west-3.amazonaws.com",
  "https://dynamodb.eu-south-2.amazonaws.com",
  "https://dynamodb.eu-north-1.amazonaws.com",
  "https://dynamodb.eu-central-2.amazonaws.com",
  "https://dynamodb.il-central-1.amazonaws.com",
  "https://dynamodb.me-south-1.amazonaws.com",
  "https://dynamodb.me-central-1.amazonaws.com",
  "https://dynamodb.sa-east-1.amazonaws.com",
  "https://dynamodb.us-gov-east-1.amazonaws.com",
  "https://dynamodb.us-gov-west-1.amazonaws.com",
];

export default DYNAMODB;
