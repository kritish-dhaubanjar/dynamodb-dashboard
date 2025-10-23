const config = {
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

export default config;
