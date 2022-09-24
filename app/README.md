# dynamodb-dashboard-app
## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
yarn
```

###### Compile and Hot-Reload for Development

```sh
yarn dev
```

###### Type-Check, Compile and Minify for Production

```sh
yarn build
```

###### Ignore Type-Check, Compile and Minify for Production

```sh
yarn build-only
```

###### Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```

#### Environment variables
For local development with separate server instance:
```shell
VITE_APP_BASE_URL=/dynamodb
VITE_API_BASE_URL=http://localhost:4567/dynamodb/api
```

For build to bundle with server instance:
```shell
VITE_APP_BASE_URL=/dynamodb
VITE_API_BASE_URL=/dynamodb/api
```

**NOTE**: To bundle SPA Vue.js app, build `app`, and copy `app/dist` to `server/build/public`.
