const config = {
  aws: {
    region: process.env.AWS_REGION ?? "us-west-2",
    endpoint: process.env.AWS_ENDPOINT ?? "http://127.0.0.1:8000",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "fakeAccessKeyId",
      sessionToken: process.env.AWS_SESSION_TOKEN ?? "fakeSessionToken",
      secretAccessKey:
        process.env.AWS_SECRET_ACCESS_KEY ?? "fakeSecretAccessKey",
    },
  },
};

export default config;
