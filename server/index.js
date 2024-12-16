const express = require("express");
const router = require("./Routes/index");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/api", router);

app.listen(5001, function () {
  console.log("Server started on port 5001!");
});
