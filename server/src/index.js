import "dotenv/config";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import express from "express";
import routes from "./routes";
import AWS from "./config/aws";
import compression from "compression";
import errorHandler from "./errors/handler";

AWS.initialize();

const app = express();
app.use(compression());
app.use(cors({ origin: "*" }));

app.use(morgan("dev"));
app.use(express.json());

// api
app.use("/dynamodb/api", routes);

// assets
app.use("/dynamodb", express.static(path.join(__dirname, "..", "public")));

// spa
app.get("/dynamodb/*file", (_req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
});

app.get("{*file}", (_req, res)  => {
  res.redirect("/dynamodb");
});

app.use(errorHandler);

const server = app.listen(4567, () => {
  console.info(`dynamodb-dashboard started at: http://127.0.0.1:4567/dynamodb\n`);
});
