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
