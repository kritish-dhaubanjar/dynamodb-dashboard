import "dotenv/config";
import path from "path";
import morgan from "morgan";
import express from "express";
import compression from "compression";
import routes from "../routes";
import AWS from "../config/aws";
import errorHandler from "../errors/handler";

AWS.initialize();

export default ({ port, host, debug, prefix }) => {
  const root = `http://${host}:${port}`;
  const URL = `${root}/${prefix}`;

  const app = express();
  app.use(compression());
  app.use(express.json());

  if (debug) {
    app.use(morgan("dev"));
  }

  // eg: /dynamodb/api
  const SPA = `/${prefix}/*`;
  const ASSETS = `/${prefix}`;
  const API = `/${prefix}/api`;

  // api
  app.use(API, routes);

  // assets
  app.use(ASSETS, express.static(path.join(__dirname, "..", "public")));

  // spa
  app.get(SPA, (_req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
  });

  app.get("*", (_req, res) => {
    res.redirect(ASSETS);
  });

  app.use(errorHandler);

  app.listen(port, host, () => {
    console.info(`dynamodb-dashboard started at: ${URL}\n`);
  });
};
