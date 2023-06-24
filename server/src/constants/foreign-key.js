export const ForeignKeyTableSchema = {
  "TableName": "ForeignKeysCollection",
  "ProvisionedThroughput": {
    "ReadCapacityUnits": 5,
    "WriteCapacityUnits": 5
  },
  "KeySchema": [
    {
      "AttributeName": "TableName",
      "KeyType": "HASH"
    },
    {
      "AttributeName": "AttributeName",
      "KeyType": "RANGE"
    }
  ],
  "AttributeDefinitions": [
    {
      "AttributeName": "TableName",
      "AttributeType": "S"
    },
    {
      "AttributeName": "AttributeName",
      "AttributeType": "S"
    }
  ]
};

export const ForeignKeyExampleItem = {
  "TableName": "dev_Organizations",
  "AttributeName": "mainOrgId_hubOrgId",
  "AttributeValue": "<mainOrgId>_<hubOrgId>",
  "References": {
    "mainOrgId": {
      "TableName": "dev_Organizations",
      "AttributeName": "orgId"
    },
    "hubOrgId": {
      "TableName": "dev_Organizations",
      "AttributeName": "orgId"
    }
  }
};
