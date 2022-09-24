# dynamodb-dashboard-server

## Project Setup

```sh
yarn
```

###### Compile and Hot-Reload for Development

```sh
yarn dev
```

###### Compile and Minify for Production

```sh
yarn build
```

#### Environment variables
For local development:
```shell
AWS_REGION = us-west-2
AWS_ENDPOINT = http://localhost:8000

AWS_ACCESS_KEY_ID = fakeMyKeyId
AWS_SESSION_TOKEN = fakeSessionToken
AWS_SECRET_ACCESS_KEY = fakeSecretAccessKey
```

**NOTE**: To bundle SPA Vue.js app, build `app`, and copy `app/dist` to `server/build/public`.
