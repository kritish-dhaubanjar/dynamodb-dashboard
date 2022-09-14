import { generateString } from "./string";

export function generateTableHeaders(items = [], { KeySchema = [] }) {
  let max = {};

  const hashKey = KeySchema.find(({ KeyType }) => KeyType === "HASH") ?? {};
  const rangeKey = KeySchema.find(({ KeyType }) => KeyType === "RANGE") ?? {};

  for (const item of items) {
    if (Object.keys(item).length > Object.keys(max).length) {
      max = item;
    }
  }

  const headers = Object.keys(max).filter(
    (key) => ![hashKey.AttributeName, rangeKey.AttributeName].includes(key)
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
    const gsi = table.GlobalSecondaryIndexes?.find(
      ({ IndexName }: { IndexName: string }) => IndexName === indexName
    );
    keySchema = gsi?.KeySchema ?? [];
  }

  const keySchemaWithAttributeType = keySchema.map((key) => {
    const { AttributeType } = table.AttributeDefinitions.find(
      (attributeDefinition: any) =>
        key.AttributeName === attributeDefinition.AttributeName
    );

    return {
      ...key,
      AttributeType,
    };
  });

  const pk = keySchemaWithAttributeType.find(
    ({ KeyType }) => KeyType === "HASH"
  );
  const sk = keySchemaWithAttributeType.find(
    ({ KeyType }) => KeyType === "RANGE"
  );

  return {
    pk,
    sk,
    keySchemaWithAttributeType,
  };
}

function valueOf(value, AttributeType) {
  if (AttributeType === "S") return String(value);
  if (AttributeType === "N") return parseInt(value);
}

export function generateDynamodbParameters({ table, indexName, parameters }) {
  const { pk, sk } = getKeySchemaWithAttributeType({ table, indexName });

  if (!pk || !parameters?.keys) return;

  let filterExpression = "";
  let skConditionExpression = "";
  let pkConditionExpression = "";
  const attributeNames: any = {};
  const attributeValues: any = {};

  // PK
  if (pk && parameters.keys.pk.value) {
    pkConditionExpression = `#${pk.AttributeName} ${parameters.keys.pk.condition} :${pk.AttributeName}`;

    attributeNames[`#${pk.AttributeName}`] = pk.AttributeName;
    attributeValues[`:${pk.AttributeName}`] = valueOf(
      parameters.keys.pk.value,
      pk.AttributeType
    );
  }

  // SK
  if (pk && parameters.keys.sk) {
    if (sk && parameters.keys.sk.value1) {
      attributeNames[`#${sk.AttributeName}`] = sk.AttributeName;

      // begins_with
      if (parameters.keys.sk.condition === "begins_with") {
        skConditionExpression = `begins_with(#${sk.AttributeName}, :${sk.AttributeName})`;
        attributeValues[`:${sk.AttributeName}`] = valueOf(
          parameters.keys.sk.value1,
          sk.AttributeType
        );
      }
      // between
      else if (parameters.keys.sk.condition === "between") {
        skConditionExpression = `#${sk.AttributeName} between :${sk.AttributeName}1 and :${sk.AttributeName}2`;
        attributeValues[`:${sk.AttributeName}1`] = valueOf(
          parameters.keys.sk.value1,
          sk.AttributeType
        );
        attributeValues[`:${sk.AttributeName}2`] = valueOf(
          parameters.keys.sk.value2,
          sk.AttributeType
        );
      }
      // =, <=, <, >=, >
      else {
        skConditionExpression = `#${sk.AttributeName} ${parameters.keys.sk.condition} :${sk.AttributeName}`;
        attributeValues[`:${sk.AttributeName}`] = valueOf(
          parameters.keys.sk.value1,
          sk.AttributeType
        );
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
    const { name, value, type, condition, value2, salt } = filter;

    let expression = "";
    if (!condition) continue;

    if (["attribute_exists", "attribute_not_exists"].includes(condition)) {
      expression = `${condition}(#${name})`;
      attributeNames[`#${name}`] = name;
      filters.push(expression);
    }

    //
    if (!name || !value || !type || (condition === "between" && !value2))
      continue;

    if (["begins_with", "contains", "not contains"].includes(condition)) {
      expression = `${condition}(#${name}, :${salt})`;
      attributeNames[`#${name}`] = name;
      attributeValues[`:${salt}`] = valueOf(value, type);
    } else if ("between" === condition) {
      expression = `#${name} between :${salt}1 and :${salt}2`;
      attributeNames[`#${name}`] = name;
      attributeValues[`:${salt}1`] = valueOf(value, type);
      attributeValues[`:${salt}2`] = valueOf(value2, type);
    } else {
      expression = `#${name} ${condition} :${salt}`;
      attributeNames[`#${name}`] = name;
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
