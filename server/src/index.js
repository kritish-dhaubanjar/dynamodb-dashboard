import "dotenv/config";
import cors from "cors";
import path from "path";
import morgan from "morgan";
import express from "express";
import routes from "./routes";
import errorHandler from "./errors/handler";

const app = express();
app.use(cors({ origin: "*" }));

app.use(morgan("dev"));
app.use(express.json());

// api
app.use("/dynamodb/api", routes);

// assets
app.use("/dynamodb", express.static(path.join(__dirname, "..", "public")));

// spa
app.get("/dynamodb/*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "..", "public", "index.html"));
});

app.use(errorHandler);

app.listen(8080, () => {
  console.log(`Server started at http://localhost:8080`);
});
