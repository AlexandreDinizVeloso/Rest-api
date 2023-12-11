const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const routes = require("./routes/routes");

const mongoString = process.env.DATABASE_URL;

mongoose.connect(mongoString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const database = mongoose.connection;

database.on("error", (error) => {
  console.error("Erro conectando ao DB:", error);
});

database.once("connected", () => {
  console.log("Conexão estabelecida");
});

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());
app.use("/api", routes);

app.use(express.static("public"));

app.get("/worker", (req, res) => {
  const workerPath = path.join(__dirname, "public", "worker.html");
  res.sendFile(workerPath);
});

app.listen(PORT, () => {
  console.log(`Banco de dados funcionando na porta: ${PORT}`);
});
