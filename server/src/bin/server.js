import "dotenv/config";
import open from "open";
import path from "path";
import morgan from "morgan";
import express from "express";
import routes from "../routes";
import AWS from "../config/aws";
import errorHandler from "../errors/handler";

AWS.initialize();

export default ({ port, host, debug, open: _open }) => {
  const root = `http://${host}:${port}`;
  const URL = `${root}/dynamodb`;

  const app = express();
  app.use(express.json());

  if (debug) {
    app.use(morgan("dev"));
  }

  // api
  app.use("/dynamodb/api", routes);

  // assets
  app.use("/dynamodb", express.static(path.join(__dirname, "..", "public")));

  // spa
  app.get("/dynamodb/*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
  });

  app.get("*", function(_req, res) {
    res.redirect("/dynamodb");
  });

  app.use(errorHandler);

  app.listen(port, host, () => {
    console.info(`dynamodb-dashboard started at: ${URL}\n`);

    if (_open) {
      open(URL);
    }
  });
};
