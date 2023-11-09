import { generateString } from "./string";

export function generateTableHeaders(items = [], { KeySchema = [] }) {
  const hashKey = KeySchema.find(({ KeyType }) => KeyType === "HASH") ?? {};
  const rangeKey = KeySchema.find(({ KeyType }) => KeyType === "RANGE") ?? {};

  const allHeaders = new Set();

  items.forEach((item) => {
    Object.keys(item).forEach(allHeaders.add, allHeaders);
  });

  const headers = Array.from(allHeaders).filter(
    (key) => ![hashKey.AttributeName, rangeKey.AttributeName].includes(key),
  );

  if (rangeKey.AttributeName) {
    headers.unshift(rangeKey.AttributeName);
  }

  headers.unshift(hashKey.AttributeName);

  return headers;
}

function getKeySchemaWithAttributeType({ indexName, table }) {
  let keySchema = [];

  if (indexName === table.TableName) {
    keySchema = table.KeySchema ?? [];
  } else {
    const secondaryIndex = [...(table.GlobalSecondaryIndexes ?? []), ...(table.LocalSecondaryIndexes ?? [])]?.find(
      ({ IndexName }: { IndexName: string }) => IndexName === indexName,
    );
    keySchema = secondaryIndex?.KeySchema ?? [];
  }

  const keySchemaWithAttributeType = keySchema.map((key) => {
    const { AttributeType } = table.AttributeDefinitions.find(
      (attributeDefinition: any) => key.AttributeName === attributeDefinition.AttributeName,
    );

    return {
      ...key,
      AttributeType,
    };
  });

  const pk = keySchemaWithAttributeType.find(({ KeyType }) => KeyType === "HASH");
  const sk = keySchemaWithAttributeType.find(({ KeyType }) => KeyType === "RANGE");

  return {
    pk,
    sk,
    keySchemaWithAttributeType,
  };
}

function valueOf(value, AttributeType) {
  if (AttributeType === "S") return String(value);
  if (AttributeType === "N") return parseInt(value);
  if (AttributeType === "BOOL") return String(value) === "true";
}

export function generateDynamodbParameters({ table, indexName, parameters }) {
  const { pk, sk } = getKeySchemaWithAttributeType({ table, indexName });

  if (!pk || !parameters?.keys) return;

  const filterExpression = "";
  let skConditionExpression = "";
  let pkConditionExpression = "";
  const attributeNames: any = {};
  const attributeValues: any = {};

  // PK
  if (pk && parameters.keys.pk.value) {
    pkConditionExpression = `#${pk.AttributeName} ${parameters.keys.pk.condition} :${pk.AttributeName}`;

    attributeNames[`#${pk.AttributeName}`] = pk.AttributeName;
    attributeValues[`:${pk.AttributeName}`] = valueOf(parameters.keys.pk.value, pk.AttributeType);
  }

  // SK
  if (pk && parameters.keys.sk) {
    if (sk && parameters.keys.sk.value1) {
      attributeNames[`#${sk.AttributeName}`] = sk.AttributeName;

      // begins_with
      if (parameters.keys.sk.condition === "begins_with") {
        skConditionExpression = `begins_with(#${sk.AttributeName}, :${sk.AttributeName})`;
        attributeValues[`:${sk.AttributeName}`] = valueOf(parameters.keys.sk.value1, sk.AttributeType);
      }
      // between
      else if (parameters.keys.sk.condition === "between") {
        skConditionExpression = `#${sk.AttributeName} between :${sk.AttributeName}1 and :${sk.AttributeName}2`;
        attributeValues[`:${sk.AttributeName}1`] = valueOf(parameters.keys.sk.value1, sk.AttributeType);
        attributeValues[`:${sk.AttributeName}2`] = valueOf(parameters.keys.sk.value2, sk.AttributeType);
      }
      // =, <=, <, >=, >
      else {
        skConditionExpression = `#${sk.AttributeName} ${parameters.keys.sk.condition} :${sk.AttributeName}`;
        attributeValues[`:${sk.AttributeName}`] = valueOf(parameters.keys.sk.value1, sk.AttributeType);
      }
    }
  }

  const filters = [];
  let scan = parameters.scan ?? [];

  scan = scan
    .filter(({ name }) => !!name)
    .map((filter) => ({
      ...filter,
      salt: generateString(),
    }));

  for (const filter of scan) {
    let { name } = filter;
    const { value, type, condition, value2, salt } = filter;

    const attributes = name.split(".");
    name = name.replaceAll(".", ".#");

    let expression = "";
    if (!condition) continue;

    if (["attribute_exists", "attribute_not_exists"].includes(condition)) {
      expression = `${condition}(#${name})`;
      attributes.map((name) => (attributeNames[`#${name}`] = name));
      filters.push(expression);
      continue;
    }

    //
    if (!name || !type || (condition === "between" && !value2)) continue;

    if (["begins_with", "contains", "not contains"].includes(condition)) {
      expression = `${condition}(#${name}, :${salt})`;
      attributes.map((name) => (attributeNames[`#${name}`] = name));
      attributeValues[`:${salt}`] = valueOf(value, type);
    } else if ("between" === condition) {
      expression = `#${name} between :${salt}1 and :${salt}2`;
      attributes.map((name) => (attributeNames[`#${name}`] = name));
      attributeValues[`:${salt}1`] = valueOf(value, type);
      attributeValues[`:${salt}2`] = valueOf(value2, type);
    } else {
      expression = `#${name} ${condition} :${salt}`;
      attributes.map((name) => (attributeNames[`#${name}`] = name));
      attributeValues[`:${salt}`] = valueOf(value, type);
    }

    filters.push(expression);
  }

  const IndexName = indexName === table.TableName ? null : indexName;

  return {
    // IndexName
    ...(IndexName && { IndexName }),

    // KeyConditionExpression
    ...(pk &&
      parameters.keys.pk.value && {
        KeyConditionExpression:
          sk && parameters.keys.sk?.value1
            ? [pkConditionExpression, skConditionExpression].join(" and ")
            : pkConditionExpression,
      }),

    // FilterExpression
    ...(Object.keys(filters).length && {
      FilterExpression: filters.join(" and "),
    }),

    // ExpressionAttributeNames
    ...(Object.keys(attributeNames).length && {
      ExpressionAttributeNames: attributeNames,
    }),

    // ExpressionAttributeValues
    ...(Object.keys(attributeValues).length && {
      ExpressionAttributeValues: attributeValues,
    }),
  };
}

export function generateDynamodbIndexParameters({ indices = [], deleteIndices = [] }) {
  const parameters = {};

  const gsis = indices.filter(({ readOnly }) => !readOnly);

  if (gsis.length || deleteIndices.length) {
    parameters.GlobalSecondaryIndexUpdates = [];
  }

  if (deleteIndices.length) {
    const deletes = deleteIndices.map((indexName) => ({
      Delete: { IndexName: indexName },
    }));

    parameters.GlobalSecondaryIndexUpdates.push(...deletes);
  }

  if (gsis.length) {
    parameters.AttributeDefinitions = [];

    const creates = gsis.map(({ name, pk = { name: "", type: "" }, sk = { name: "", type: "" } }) => {
      const index = {
        IndexName: name,
        Projection: {
          ProjectionType: "ALL",
        },
        KeySchema: [
          {
            AttributeName: pk.name,
            KeyType: "HASH",
          },
          ...(sk.name.trim()
            ? [
                {
                  AttributeName: sk.name,
                  KeyType: "RANGE",
                },
              ]
            : []),
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      };

      const pkExists = parameters.AttributeDefinitions.find(({ AttributeName }) => AttributeName === pk.name);

      const skExists = parameters.AttributeDefinitions.find(({ AttributeName }) => AttributeName === sk.name);

      if (!pkExists) {
        parameters.AttributeDefinitions.push({
          AttributeName: pk.name,
          AttributeType: pk.type,
        });
      }

      if (!skExists && sk.name.trim()) {
        parameters.AttributeDefinitions.push({
          AttributeName: sk.name,
          AttributeType: sk.type,
        });
      }

      return index;
    });

    parameters.GlobalSecondaryIndexUpdates.push(
      ...creates.map((index) => ({
        Create: index,
      })),
    );
  }

  return parameters;
}

export function generateDynamodbTableParameters({
  name = "",
  throughput: { read = 5, write = 5 },
  keySchema: { pk = { name: "", type: "" }, sk = { name: "", type: "" } },
  indices = [],
}) {
  const parameters = {
    TableName: name,
    ProvisionedThroughput: {
      ReadCapacityUnits: read,
      WriteCapacityUnits: write,
    },
    KeySchema: [
      {
        AttributeName: pk.name,
        KeyType: "HASH",
      },
      ...(sk.name.trim()
        ? [
            {
              AttributeName: sk.name,
              KeyType: "RANGE",
            },
          ]
        : []),
    ],
    AttributeDefinitions: [
      {
        AttributeName: pk.name,
        AttributeType: pk.type,
      },
      ...(sk.name.trim()
        ? [
            {
              AttributeName: sk.name,
              AttributeType: sk.type,
            },
          ]
        : []),
    ],
    /*
    GlobalSecondaryIndexes: [
      {
        IndexName: "",
        Projection: {
          ProjectionType: "ALL",
        },
        KeySchema: [
          {
            AttributeName: "",
            KeyType: "HASH",
          },
          {
            AttributeName: "",
            KeyType: "RANGE",
          },
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      },
    ],
    LocalSecondaryIndexes: [
      {
        IndexName: "",
        KeySchema: [
          {
            AttributeName: "",
            KeyType: "HASH",
          },
          {
            AttributeName: "",
            KeyType: "RANGE",
          },
        ],
        Projection: {
          ProjectionType: "ALL",
        },
      },
    ], 
    */
  };

  const gsis = indices.filter(({ type }) => type === "GSI");
  const lsis = indices.filter(({ type }) => type === "LSI");

  if (gsis.length) {
    parameters["GlobalSecondaryIndexes"] = gsis.map(
      ({ name, pk = { name: "", type: "" }, sk = { name: "", type: "" } }) => {
        const index = {
          IndexName: name,
          Projection: {
            ProjectionType: "ALL",
          },
          KeySchema: [
            {
              AttributeName: pk.name,
              KeyType: "HASH",
            },
            ...(sk.name.trim()
              ? [
                  {
                    AttributeName: sk.name,
                    KeyType: "RANGE",
                  },
                ]
              : []),
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: read,
            WriteCapacityUnits: write,
          },
        };

        const pkExists = parameters.AttributeDefinitions.find(({ AttributeName }) => AttributeName === pk.name);

        const skExists = parameters.AttributeDefinitions.find(({ AttributeName }) => AttributeName === sk.name);

        if (!pkExists) {
          parameters.AttributeDefinitions.push({
            AttributeName: pk.name,
            AttributeType: pk.type,
          });
        }

        if (!skExists && sk.name.trim()) {
          parameters.AttributeDefinitions.push({
            AttributeName: sk.name,
            AttributeType: sk.type,
          });
        }

        return index;
      },
    );
  }

  if (lsis.length) {
    parameters["LocalSecondaryIndexes"] = lsis.map(({ name, sk = { name: "", type: "" } }) => {
      const index = {
        IndexName: name,
        Projection: {
          ProjectionType: "ALL",
        },
        KeySchema: [
          {
            AttributeName: pk.name,
            KeyType: "HASH",
          },
          ...(sk.name.trim()
            ? [
                {
                  AttributeName: sk.name,
                  KeyType: "RANGE",
                },
              ]
            : []),
        ],
      };

      const skExists = parameters.AttributeDefinitions.find(({ AttributeName }) => AttributeName === sk.name);

      if (!skExists) {
        parameters.AttributeDefinitions.push({
          AttributeName: sk.name,
          AttributeType: sk.type,
        });
      }

      return index;
    });
  }

  return parameters;
}
