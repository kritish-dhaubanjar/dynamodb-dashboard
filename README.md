<img width="80" height="78" alt="dynamodb-dashboard" src="https://github.com/user-attachments/assets/2d236911-32bb-4fc1-9af5-ee494da076e8" />

## DynamoDB Dashboard

A Web GUI Dashboard for local or remote [DynamoDB](https://aws.amazon.com/blogs/aws/dynamodb-local-for-desktop-development/).

![npm](https://img.shields.io/npm/v/dynamodb-dashboard?label=npm&style=flat-square) ![npm](https://img.shields.io/npm/dw/dynamodb-dashboard?style=flat-square) ![NPM](https://img.shields.io/npm/l/dynamodb-dashboard?style=flat-square)

![Docker Pulls](https://img.shields.io/docker/pulls/kritishdhaubanjar/dynamodb-dashboard?style=flat-square) ![Docker Image Size (tag)](https://img.shields.io/docker/image-size/kritishdhaubanjar/dynamodb-dashboard/latest?style=flat-square)

[![dynamodb-dashboard Builder](https://img.shields.io/github/actions/workflow/status/kritish-dhaubanjar/dynamodb-dashboard/build.yml?branch=main&label=dynamodb-dashboard%20Builder&style=flat-square)](https://github.com/kritish-dhaubanjar/dynamodb-dashboard/actions/workflows/build.yml)

#### Installation:
Install application globally:
```shell
npm install --global dynamodb-dashboard
```

#### Setting Environment variables
Currently, following environment variables are supported, with default values:

- `AWS_REGION` (default: us-west-2)
- `AWS_ENDPOINT` (default: http://127.0.0.1:8000)

To configure, set the AWS environment variables in the terminal session before launching `dynamodb-dashboard`, example in `.bashrc` file.

#### AWS Credentials Resolution
The application uses the AWS SDK for [JavaScript (v2)](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html), which supports multiple ways to load credentials automatically through the default credential provider chain.

Explicitly passed environment variables
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN` (optional)
> These take highest priority if provided.

Start `dynamodb-dashboard` instance:
```shell
dynamodb-dashboard start
```

##### Options
- `-d, --debug` : show log output of running application (default: false)
- `-p, --port <port>` : port to run app (default: 4567)
- `-h, --host <host>` : host to run app (default: 127.0.0.1)

### Development Setup
1. [Setup Vue.js App](https://github.com/kritish-dhaubanjar/dynamodb-dashboard/tree/main/app)
2. [Setup Node Express Server](https://github.com/kritish-dhaubanjar/dynamodb-dashboard/tree/main/server)

**OR**

1.  ```shell
    git clone https://github.com/kritish-dhaubanjar/dynamodb-dashboard.git
    ```
2. ```shell
   cd dynamodb-dashboard
   ```
3. ```shell
   make watch
   ```

## Docker

<details>
  <summary><h4>Run a container (<a href="https://hub.docker.com/r/kritishdhaubanjar/dynamodb-dashboard">from Docker Hub</a>)</h4></summary>

  1. ```shell
     docker pull kritishdhaubanjar/dynamodb-dashboard:latest
     ```
  2. ```shell
     docker run -p 8080:4567 kritishdhaubanjar/dynamodb-dashboard:latest
     ```
  *Environment Variables:*
  - `AWS_REGION` (default: `us-west-2`)
  - `AWS_ENDPOINT` (default: `http://127.0.0.1:8000`)
</details>
<details>
  <summary><h4>Build Docker image and run a container (from source & Dockerfile)</h4></summary>
  
  **a. Clone Repository**
  1. ```shell
     git clone https://github.com/kritish-dhaubanjar/dynamodb-dashboard.git
     ```
  2. ```shell
     cd dynamodb-dashboard
     ```
  
  **b. Build Docker Image**
  ```shell
  docker build . -t dynamodb-dashboard:local
  ```
  
  *Build Arguments:*
  - `PORT_ARG` (default: `4567`)
  - `HOST_ARG` (default: `0.0.0.0`)
  - `PREFIX_ARG` (default: `dynamodb`, prefix of route URIs)
  
  **c. Run Docker Container**
  ```shell
  docker run -p 8080:4567 dynamodb-dashboard:local
  ```
  
  *Environment Variables:*
  - `AWS_REGION` (default: `us-west-2`)
  - `AWS_ENDPOINT` (default: `http://127.0.0.1:8000`)
  
  *NOTE: For dynamodb running in the host machine, use flag `--network=host` for running dynamodb-dashboard container.*
</details>

## NGINX Config
To configure Nginx to serve dynamodb-dashboard with (EventSource (Server-Sent Events or SSE) event stream), you need to ensure Nginx is correctly set up to handle long-lived HTTP connections and provide appropriate headers. Here's a basic example configuration:
```nginx
server
{
    listen 80;
    listen [::]:80;

    server_name _;

    proxy_read_timeout 1d;
    proxy_send_timeout 1d;
    proxy_connect_timeout 1d;

    location /
    {
        proxy_pass http://localhost:4567;
    }

    location /dynamodb/api/database/stream/
    {
        proxy_buffering off;
        proxy_cache off;
        chunked_transfer_encoding off;

        add_header Content-Type text/event-stream;
        add_header Cache-Control no-cache;
        add_header Connection keep-alive;

        proxy_pass http://localhost:4567;
    }
}
```

### Preview:
![dynamodb-dashboard](https://user-images.githubusercontent.com/25634165/213922274-d70cde00-4d70-47ac-ab84-68b6f0933d58.png)

![image](https://user-images.githubusercontent.com/25634165/215118400-fe18ea87-5562-4e7d-be7b-ccf61a3fbe99.png)

### Demo:
https://user-images.githubusercontent.com/25634165/192109458-a621bc06-788d-4d54-9dc2-9064380ee837.mp4

[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-orange?style=for-the-badge&logo=buy-me-a-coffee)](https://www.buymeacoffee.com/kritishdhaubanjar)

## Contributors ✨

Thanks goes to these wonderful people:

<table>
  <tr>
    <td align="center"><a href="https://github.com/sbimochan"><img src="https://avatars.githubusercontent.com/u/11685953?v=4" width="100px;" alt=""/><br /><sub><b>Bimochan Shrestha</b></sub></a><br /><a href="https://github.com/kritish-dhaubanjar/dynamodb-dashboard/commits?author=sbimochan" title="Commits">📖</a></td>
    <td align="center"><a href="https://github.com/bipinmdr07"><img src="https://avatars.githubusercontent.com/u/16375412?v=4" width="100px;" alt=""/><br /><sub><b>Bipin Manandhar</b></sub></a><br /><a href="https://github.com/kritish-dhaubanjar/dynamodb-dashboard/commits?author=bipinmdr07" title="Commits">📖</a></td>
    <td align="center"><a href="https://github.com/maskeynihal"><img src="https://avatars.githubusercontent.com/u/26411488?v=4" width="100px;" alt=""/><br /><sub><b>Nihal Maskey</b></sub></a><br /><a href="https://github.com/kritish-dhaubanjar/dynamodb-dashboard/commits?author=maskeynihal" title="Commits">📖</a></td>
    <td align="center"><a href="https://github.com/bhattaraib58"><img src="https://avatars.githubusercontent.com/u/15843175?v=4" width="100px;" alt=""/><br /><sub><b>Biplap Bhattarai</b></sub></a><br /><a href="https://github.com/kritish-dhaubanjar/dynamodb-dashboard/commits?author=bhattaraib58" title="Commits">📖</a></td>
    <td align="center"><a href="https://github.com/JimDabell"><img src="https://avatars.githubusercontent.com/u/5674?v=4" width="100px;" alt=""/><br /><sub><b>Jim Dabell</b></sub></a><br /><a href="https://github.com/kritish-dhaubanjar/dynamodb-dashboard/commits?author=JimDabell" title="Commits">📖</a></td>
      <td align="center"><a href="https://github.com/yyyoichi"><img src="https://avatars.githubusercontent.com/u/67273105?v=4" width="100px;" alt=""/><br /><sub><b>yyyoichi</b></sub></a><br /><a href="https://github.com/kritish-dhaubanjar/dynamodb-dashboard/commits?author=yyyoichi" title="Commits">📖</a></td>
  </tr>
</table>

# License
Distributed under the MIT License. See `LICENSE` for more information.
