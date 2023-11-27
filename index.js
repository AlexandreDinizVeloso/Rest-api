const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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
app.use(express.json());
app.use(cors());
app.use("/api", routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando na porta: ${PORT}`);
});
