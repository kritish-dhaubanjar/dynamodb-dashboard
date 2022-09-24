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
