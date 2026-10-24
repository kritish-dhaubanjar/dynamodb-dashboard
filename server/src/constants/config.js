const config = {
  app: {
    port: 4567,
    debug: true,
    host: "127.0.0.1",
    prefix: "dynamodb",
  },
  aws: {
    region: process.env.AWS_REGION,
    endpoint: process.env.AWS_ENDPOINT,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      sessionToken: process.env.AWS_SESSION_TOKEN,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  },
};

export function initialize({ port = 4567, host = "127.0.0.1", debug = true, prefix = "dynamodb" }) {
  config.app.port = port;
  config.app.host = host;
  config.app.debug = debug;
  config.app.prefix = prefix;
}

export default config;
