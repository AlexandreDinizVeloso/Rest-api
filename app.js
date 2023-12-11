require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const bot = require("./bot");

bot.command("start", (ctx) => {
  console.log(`Nova conversa. User ID: ${ctx.message.from.id}`);
  bot.telegram.sendMessage(
    ctx.message.from.id,
    "Bem vindo ao BOT, faça seu pedido usando o comando /pedir!"
  );
});

bot.command("pedir", async (ctx) => {
  const userId = ctx.message.from.id;
  const orderId = uuidv4();
  bot.telegram.sendMessage(
    userId,
    `Faça seu pedido aqui: https://fastfoodapi-hflk.onrender.com/orders/${userId}/${orderId}`
  );
});

app.use(express.json());
app.use(express.static("public"));

app.get(`/orders/:userId/:orderId`, (req, res) => {
  const userId = req.params.userId;
  const orderId = req.params.orderId;

  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Bot executando na porta ${PORT}`);
});

bot.launch();
