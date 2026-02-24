const express = require("express");
const cors = require("cors");
const checkUrlRoute = require("./routes/checkUrl");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", checkUrlRoute);

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});