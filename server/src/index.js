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
app.use("/dynamodb", express.static(path.join(__dirname, "..", "public")));

app.use("/dynamodb/api", routes);
app.use(errorHandler);

app.listen(8080, () => {
  console.log(`Server started at http://localhost:8080`);
});
