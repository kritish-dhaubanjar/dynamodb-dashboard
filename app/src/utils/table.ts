export function generateTableHeaders(items = [], { KeySchema = [] }) {
  let max = {};

  const hashKey = KeySchema.find(({ KeyType }) => KeyType === "HASH") ?? {};

  for (const item of items) {
    if (Object.keys(item).length > Object.keys(max).length) {
      max = item;
    }
  }

  const headers = Object.keys(max).filter(
    (key) => key !== hashKey.AttributeName
  );

  headers.unshift(hashKey.AttributeName);

  return headers;
}
