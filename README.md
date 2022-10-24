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

##### Options
- `-d, --debug` : show log output of running application (default: false)
- `-o, --open` : open http://\<host>:\<port>/dynamodb (default: false)
- `-p, --port <port>` : port to run app (default: 4567)
- `-h, --host <host>` : host to run app (default: 127.0.0.1)

#### Setting Environment variables
Currently, following environment variables are supported, with default values:

- `AWS_REGION` (default: us-west-2)
- `AWS_ENDPOINT` (default: http://127.0.0.1:8000)
- `AWS_ACCESS_KEY_ID` (default: fakeAccessKeyId)
- `AWS_SECRET_ACCESS_KEY` (default: fakeSecretAccessKey)
- `AWS_SESSION_TOKEN` (optional)

To configure, set the AWS environment variables in the terminal session before launching `dynamodb-dashboard`, example in `.bashrc` file.

### Development Setup
1. [Setup Vue.js App](https://github.com/kritish-dhaubanjar/dynamodb-dashboard/tree/main/app)
2. [Setup Node Express Server](https://github.com/kritish-dhaubanjar/dynamodb-dashboard/tree/main/server)

### Preview:
![dynamodb-dashboard](https://media.discordapp.net/attachments/896610721754910751/1033278926031691806/unknown.png?width=1362&height=666)

### Demo:
https://user-images.githubusercontent.com/25634165/192109458-a621bc06-788d-4d54-9dc2-9064380ee837.mp4

# License
Distributed under the MIT License. See `LICENSE` for more information.
