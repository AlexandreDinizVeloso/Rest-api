const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },

    price: {
        required: true,
        type: Number
    },

    description: {
        required: false,
        type: String,
    },

    image: {
        data: Buffer,
        contentType: String
    }
})

module.exports = mongoose.model('Produtos', productSchema)