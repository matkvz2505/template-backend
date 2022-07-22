const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        userId: { type: String, require: true },
        product: [
            {
                productId: {
                    type: String,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
        amount: { type: Number, require: true },
        address: { type: String, require: true },
        status: { type: String, default: true }
    },
    { timestamps: true },
);

module.exports = mongoose.model('Order', orderSchema );