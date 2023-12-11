const express = require("express");
const router = express.Router();
const { Product, Order } = require("../model/model");

const bot = require("../bot");

router.post("/products", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/products/:category", async (req, res) => {
  try {
    const product = await Product.find({ category: req.params.category });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/orders/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;

    const originalOrder = await Order.findOne({ orderId: orderId });

    if (!originalOrder) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: orderId },
      { $set: req.body },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    const userId = updatedOrder.userId;
    const orderState = updatedOrder.orderState;

    res.json(updatedOrder);

    bot.telegram.sendMessage(
      userId,
      `O estado do seu pedido "${orderId}" foi alterado para "${orderState}"`
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.json({ message: `'${product.name}' deletado com sucesso.` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/orders", async (req, res) => {
  try {
    const { userId, orderId, items } = req.body;

    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          product: product._id,
          name: product.name,
          quantity: item.quantity,
          price: product.price,
        };
      })
    );

    const telegramChatId = req.body.telegramChatId;

    const order = await Order.create({
      userId: userId,
      orderId: orderId,
      items: populatedItems,
      orderState: "Preparação",
      telegramChatId: telegramChatId,
    });

    res.status(201).json(order);
    bot.telegram.sendMessage(
      userId,
      `Pedido número "${orderId}" foi criado com sucesso.`
    );
  } catch (error) {
    console.error("Pedido não encontrado:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/orders/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      return res.status(404).json({ message: "Pedido não encontrado" });
    }

    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

module.exports = router;
