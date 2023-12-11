const { Order } = require("./model/model");

async function sendOrderNotification(bot, orderId, orderState, userId) {
  try {
    bot.telegram.sendMessage(
      userId,
      `O estado do seu pedido "${orderId}" foi alterado para "${orderState}"`
    );
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  sendOrderNotification,
};
