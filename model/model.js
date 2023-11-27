const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { required: true, type: String },
  price: { required: true, type: Number },
  description: { required: false, type: String },
  image: { required: true, type: String },
  category: { required: true, type: String },
});

const Product = mongoose.model("Product", productSchema);

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  orderId: {
    type: Number,
    required: true,
  },
  items: [orderItemSchema],
  orderState: {
    type: String,
    enum: ["Preparação", "Em progresso", "Finalizado"],
    default: "Preparação",
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = { Product, Order };
