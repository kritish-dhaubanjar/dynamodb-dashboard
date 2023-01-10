![icons8-database-administrator-96](https://user-images.githubusercontent.com/25634165/204095372-d6d8362f-3a33-4ab7-8b97-330fe712c404.png)

## DynamoDB Dashboard

A Web GUI Dashboard for local or remote [DynamoDB](https://aws.amazon.com/blogs/aws/dynamodb-local-for-desktop-development/), inspired from [dynamodb-admin](https://github.com/aaronshaf/dynamodb-admin).

![npm](https://img.shields.io/npm/v/dynamodb-dashboard?label=npm&style=flat-square) ![npm](https://img.shields.io/npm/dw/dynamodb-dashboard?style=flat-square) ![NPM](https://img.shields.io/npm/l/dynamodb-dashboard?style=flat-square)

![Docker Pulls](https://img.shields.io/docker/pulls/kritishdhaubanjar/dynamodb-dashboard?style=flat-square) ![Docker Image Size (tag)](https://img.shields.io/docker/image-size/kritishdhaubanjar/dynamodb-dashboard/latest?style=flat-square)

[![dynamodb-dashboard Builder](https://img.shields.io/github/actions/workflow/status/kritish-dhaubanjar/dynamodb-dashboard/build.yml?branch=main&label=dynamodb-dashboard%20Builder&style=flat-square)](https://github.com/kritish-dhaubanjar/dynamodb-dashboard/actions/workflows/build.yml)

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

**OR**

```shell
$ git clone https://github.com/kritish-dhaubanjar/dynamodb-dashboard.git
$ cd dynamodb-dashboard
$ make watch
```

## Docker

### Dockerfile

<details>
  <summary><h4>1. Build Docker image & run a container (from source & Dockerfile)</h4></summary>
  
  **a. Clone Repository**
  ```shell
  $ git clone https://github.com/kritish-dhaubanjar/dynamodb-dashboard.git
  $ cd dynamodb-dashboard
  ```
  
  **b. Build Docker Image**
  ```shell
  $ docker build . -t dynamodb-dashboard:local
  ```
  
  *Build Arguments:*
  - `PORT_ARG` (default: `4567`)
  - `HOST_ARG` (default: `0.0.0.0`)
  - `PREFIX_ARG` (default: `dynamodb`, prefix of route URIs)
  
  **c. Run Docker Container**
  ```shell
  $ docker run -p 8080:4567 dynamodb-dashboard:local
  ```
  
  *Environment Variables:*
  - `AWS_REGION` (default: `us-west-2`)
  - `AWS_ENDPOINT` (default: `http://127.0.0.1:8000`)
  - `AWS_ACCESS_KEY_ID` (default: `fakeAccessKeyId`)
  - `AWS_SECRET_ACCESS_KEY` (default: `fakeSecretAccessKey`)
  - `AWS_SESSION_TOKEN` (optional)
  
  *NOTE: For dynamodb running in the host machine, use flag `--network=host` for running dynamodb-dashboard container.*
</details>
<details>
  <summary><h4>2. Run a container (<a href="https://hub.docker.com/r/kritishdhaubanjar/dynamodb-dashboard">from Docker Hub</a>)</h4></summary>
  
  ```shell
  $ docker pull kritishdhaubanjar/dynamodb-dashboard:latest
  $ docker run -p 8080:4567 kritishdhaubanjar/dynamodb-dashboard:latest
  ```
  
  *Environment Variables:*
  - `AWS_REGION` (default: `us-west-2`)
  - `AWS_ENDPOINT` (default: `http://127.0.0.1:8000`)
  - `AWS_ACCESS_KEY_ID` (default: `fakeAccessKeyId`)
  - `AWS_SECRET_ACCESS_KEY` (default: `fakeSecretAccessKey`)
  - `AWS_SESSION_TOKEN` (optional)
  
  *NOTE: For dynamodb running in the host machine, use flag `--network=host` for running dynamodb-dashboard container.*
</details>

### docker-compose

<details>
  <summary><h4>1. Build Docker image & run a container (from <a href="https://github.com/kritish-dhaubanjar/dynamodb-dashboard/blob/main/docker-compose.build.yml">docker-compose.build.yml</a>)</h4></summary>
  
  *dynamoDB image (from docker hub) + dynamodb-dashboard image (built from source)*
  
  **a. Clone Repository**
  ```shell
  $ git clone https://github.com/kritish-dhaubanjar/dynamodb-dashboard.git
  $ cd dynamodb-dashboard
  ```
  
  **b. Build & Run Docker Image**
  ```shell
  $ docker-compose -f docker-compose.build.yml up
  ```
</details>
<details>
  <summary><h4>2. Run a container (from <a href="https://github.com/kritish-dhaubanjar/dynamodb-dashboard/blob/main/docker-compose.yml">docker-compose.yml</a>)</h4></summary>
  
  *dynamoDB image (from docker hub) + dynamodb-dashboard image (from docker hub)*
  
  ```shell
  $ docker-compose up
  ```
</details>
<details>
  <summary><h4>3. Run a container (from <a href="https://github.com/kritish-dhaubanjar/dynamodb-dashboard/blob/main/docker-compose.host.yml">docker-compose.host.yml</a>) using host networking</h4></summary>
  
  *dynamoDB (host network) + dynamodb-dashboard image (from docker hub)*
  
  ```shell
  $ docker-compose -f docker-compose.host.yml up
  ```
</details>

### Preview:
![dynamodb-dashboard](https://media.discordapp.net/attachments/896610721754910751/1033278926031691806/unknown.png?width=1362&height=666)

### Demo:
https://user-images.githubusercontent.com/25634165/192109458-a621bc06-788d-4d54-9dc2-9064380ee837.mp4

# License
Distributed under the MIT License. See `LICENSE` for more information.
