## DynamoDB Dashboard

A Web GUI Dashboard for local or remote [DynamoDB](https://aws.amazon.com/blogs/aws/dynamodb-local-for-desktop-development/), inspired from [dynamodb-admin](https://github.com/aaronshaf/dynamodb-admin).

#### Installation:

Install application globally:
```shell
npm install --global dynamodb-dashboard
```

Start `dynamodb-dashboard` instance:
```shell
dynamodb-dashboard start
```

###### Options
- `-d, --debug` : show log output of running application (default: false)
- `-o, --open` : open http://\<host>:\<port>/dynamodb (default: false)
- `-p, --port <port>` : port to run app (default: 4567)
- `-h, --host <host>` : host to run app (default: 127.0.0.1)

##### Setting Environment variables
Currently, following environment variables are supported, with default values:

- `AWS_REGION` (default: us-west-2)
- `AWS_ENDPOINT` (default: http://127.0.0.1:8000)
- `AWS_ACCESS_KEY_ID` (default: fakeAccessKeyId)
- `AWS_SESSION_TOKEN` (default: fakeSessionToken)
- `AWS_SECRET_ACCESS_KEY` (default: fakeSecretAccessKey)

To configure, set the AWS environment variables in the terminal session before launching `dynamodb-dashboard`, example in `.bashrc` file.

### Development Setup
1. [Setup Vue.js App](https://github.com/kritish-dhaubanjar/dynamodb-dashboard/tree/main/app)
2. [Setup Node Express Server](https://github.com/kritish-dhaubanjar/dynamodb-dashboard/tree/main/server)

### Demo:

https://user-images.githubusercontent.com/25634165/192109458-a621bc06-788d-4d54-9dc2-9064380ee837.mp4

# License

The MIT License (MIT)

Copyright (c) 2022 Kritish Dhaubanjar

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
