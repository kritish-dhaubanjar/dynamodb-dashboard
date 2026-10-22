const {
  DynamoDBClient, CreateTableCommand, UpdateTimeToLiveCommand, ListTablesCommand, waitUntilTableExists,
} = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, BatchWriteCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({
  region: "us-west-2",
  endpoint: "http://localhost:8001",
  credentials: { accessKeyId: "fakeMyKeyId", secretAccessKey: "fakeSecretAccessKey" },
});
const doc = DynamoDBDocumentClient.from(client, { marshallOptions: { removeUndefinedValues: true } });

// Deterministic pseudo-random so reruns produce identical data.
let seed = 42;
const rand = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const hex = (n) => Array.from({ length: n }, () => "0123456789abcdef"[Math.floor(rand() * 16)]).join("");

const first = ["Ada", "Grace", "Linus", "Margaret", "Dennis", "Barbara", "Ken", "Radia", "Tim", "Hedy", "Alan", "Joan", "Niklaus", "Frances", "Edsger", "Katherine", "Guido", "Anita", "Bjarne", "Mary", "James", "Sophie", "Yukihiro", "Leslie"];
const last = ["Okafor", "Nakamura", "Silva", "Haddad", "Novak", "Sharma", "Lindqvist", "Moreau", "Kowalski", "Mbeki", "Tanaka", "Rossi", "Byrne", "Castillo", "Petrov", "Adeyemi", "Fischer", "Chen", "Dubois", "Rahman", "Olsen", "Vargas", "Ito", "Khan"];
const cities = [["Lisbon", "PT"], ["Osaka", "JP"], ["Nairobi", "KE"], ["Austin", "US"], ["Tallinn", "EE"], ["Montreal", "CA"], ["Pune", "IN"], ["Bogota", "CO"], ["Berlin", "DE"], ["Seoul", "KR"]];
const skus = [["KB-75-ISO", 129], ["MON-27-4K", 449], ["USB-C-2M", 14], ["DOCK-TB4", 259], ["HUB-7PORT", 39], ["MOUSE-ERG", 79], ["CAM-1080", 59], ["MIC-USB", 99], ["STAND-ALU", 45], ["HDPH-ANC", 199]];
const statuses = ["paid", "paid", "paid", "shipped", "shipped", "pending", "refunded"];
const plans = ["free", "free", "pro", "pro", "team"];

const isoDaysAgo = (d, h = 0) => new Date(Date.UTC(2026, 9, 21, h) - d * 86400000).toISOString();

function users(n, prefix = "usr") {
  return Array.from({ length: n }, (_, i) => {
    const f = first[i % first.length], l = last[(i * 7) % last.length];
    const created = 400 - i * 13;
    return {
      userId: `${prefix}_${1000 + i}`,
      email: `${f.toLowerCase()}.${l.toLowerCase()}@example.com`,
      name: `${f} ${l}`,
      plan: pick(plans),
      createdAt: isoDaysAgo(created, 9),
      lastLoginAt: isoDaysAgo(Math.floor(rand() * 20), Math.floor(rand() * 23)),
      settings: { theme: pick(["light", "dark"]), locale: pick(["en-US", "en-GB", "ja-JP", "pt-BR", "de-DE"]), notifications: rand() > 0.3 },
      loginCount: Math.floor(rand() * 400),
    };
  });
}

function orders(n, userCount, prefix = "ord") {
  return Array.from({ length: n }, (_, i) => {
    const lines = Array.from({ length: 1 + Math.floor(rand() * 3) }, () => { const [sku, price] = pick(skus); return { sku, qty: 1 + Math.floor(rand() * 3), unitPrice: price }; });
    const total = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);
    const [city, country] = pick(cities);
    const uid = 1000 + Math.floor(rand() * userCount);
    return {
      orderId: `${prefix}_${hex(8)}`,
      customerId: `usr_${uid}`,
      status: pick(statuses),
      total,
      currency: "USD",
      lines,
      shipTo: { city, country },
      createdAt: isoDaysAgo(Math.floor(rand() * 90), Math.floor(rand() * 23)),
    };
  });
}

function sessions(n) {
  const now = Math.floor(Date.UTC(2026, 9, 22, 12) / 1000);
  return Array.from({ length: n }, (_, i) => ({
    sessionId: `sess_${hex(12)}`,
    userId: `usr_${1000 + Math.floor(rand() * 24)}`,
    issuedAt: now - Math.floor(rand() * 86400),
    expiresAt: now + 3600 + Math.floor(rand() * 86400 * 6),
    userAgent: pick(["Mozilla/5.0 (Macintosh)", "Mozilla/5.0 (X11; Linux)", "Mozilla/5.0 (Windows NT 10.0)", "curl/8.4.0"]),
    ip: `10.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}.${Math.floor(rand() * 255)}`,
  }));
}

function events(perDevice) {
  const devices = ["sensor-03", "sensor-07", "sensor-11", "sensor-12"];
  const base = Math.floor(Date.UTC(2026, 9, 22, 8) / 1000);
  const out = [];
  for (const d of devices) for (let i = 0; i < perDevice; i++) {
    out.push({ deviceId: d, ts: base + i * 300, temperatureC: Math.round((18 + rand() * 9) * 10) / 10, humidityPct: Math.round(35 + rand() * 30), batteryPct: Math.max(5, 100 - i * 2), status: rand() > 0.92 ? "warn" : "ok" });
  }
  return out;
}

async function createTable(params) {
  try { await client.send(new CreateTableCommand(params)); await waitUntilTableExists({ client, maxWaitTime: 30 }, { TableName: params.TableName }); console.log("created", params.TableName); }
  catch (e) { if (e.name === "ResourceInUseException") console.log("exists ", params.TableName); else throw e; }
}
async function batchPut(table, items) {
  for (let i = 0; i < items.length; i += 25) {
    await doc.send(new BatchWriteCommand({ RequestItems: { [table]: items.slice(i, i + 25).map((Item) => ({ PutRequest: { Item } })) } }));
  }
  console.log("put    ", table, items.length, "items");
}
const PAY = { BillingMode: "PAY_PER_REQUEST" };

(async () => {
  await createTable({ TableName: "orders", ...PAY,
    AttributeDefinitions: [{ AttributeName: "orderId", AttributeType: "S" }, { AttributeName: "customerId", AttributeType: "S" }, { AttributeName: "createdAt", AttributeType: "S" }],
    KeySchema: [{ AttributeName: "orderId", KeyType: "HASH" }],
    GlobalSecondaryIndexes: [{ IndexName: "customerId-createdAt-index", KeySchema: [{ AttributeName: "customerId", KeyType: "HASH" }, { AttributeName: "createdAt", KeyType: "RANGE" }], Projection: { ProjectionType: "ALL" } }],
  });
  await createTable({ TableName: "users", ...PAY, AttributeDefinitions: [{ AttributeName: "userId", AttributeType: "S" }], KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }] });
  await createTable({ TableName: "sessions", ...PAY, AttributeDefinitions: [{ AttributeName: "sessionId", AttributeType: "S" }], KeySchema: [{ AttributeName: "sessionId", KeyType: "HASH" }],
    StreamSpecification: { StreamEnabled: true, StreamViewType: "NEW_AND_OLD_IMAGES" } });
  await createTable({ TableName: "events", ...PAY, AttributeDefinitions: [{ AttributeName: "deviceId", AttributeType: "S" }, { AttributeName: "ts", AttributeType: "N" }], KeySchema: [{ AttributeName: "deviceId", KeyType: "HASH" }, { AttributeName: "ts", KeyType: "RANGE" }] });
  await createTable({ TableName: "dev_orders", ...PAY, AttributeDefinitions: [{ AttributeName: "orderId", AttributeType: "S" }], KeySchema: [{ AttributeName: "orderId", KeyType: "HASH" }] });
  await createTable({ TableName: "dev_users", ...PAY, AttributeDefinitions: [{ AttributeName: "userId", AttributeType: "S" }], KeySchema: [{ AttributeName: "userId", KeyType: "HASH" }] });

  try { await client.send(new UpdateTimeToLiveCommand({ TableName: "sessions", TimeToLiveSpecification: { Enabled: true, AttributeName: "expiresAt" } })); console.log("ttl     sessions.expiresAt"); } catch (e) { console.log("ttl skip", e.name); }

  const u = users(24);
  await batchPut("users", u);
  await batchPut("orders", orders(120, 24));
  await batchPut("sessions", sessions(30));
  await batchPut("events", events(40));
  await batchPut("dev_users", users(8, "usr"));
  await batchPut("dev_orders", orders(15, 8));

  const list = await client.send(new ListTablesCommand({}));
  console.log("tables:", list.TableNames.join(", "));
})().catch((e) => { console.error("SEED FAILED", e); process.exit(1); });
