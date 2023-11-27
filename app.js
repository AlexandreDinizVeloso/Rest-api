const express = require("express");
const app = express();
const axios = require("axios");
const path = require("path");
const { Telegraf } = require("telegraf");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const { Order } = require("./model/model");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.command("start", (ctx) => {
  console.log(`Nova conversa. User ID: ${ctx.message.from.id}`);
  bot.telegram.sendMessage(
    ctx.message.from.id,
    "Bem vindo ao BOT, faça seu pedido usando o comando /pedir!"
  );
});

function generateOrderId() {
  const timestamp = new Date().getTime().toString(36);
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomString}`;
}

bot.command("pedir", async (ctx) => {
  const userId = ctx.message.from.id;
  const orderId = uuidv4();
  bot.telegram.sendMessage(
    userId,
    `Faça seu pedido aqui: http://localhost:3003/orders/${userId}/${orderId}`
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
  console.log(`Server is running on port ${PORT}`);
});

bot.launch();
