import express from "express";

const app = express();
app.use(express.static("public"));

app.listen(8000, () => {
  console.log(`Server started at http://localhost:8000`);
});
