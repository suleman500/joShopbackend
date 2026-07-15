

const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    totalPrice: {
        type: Number,
        required: true,
    },

  
    status: {
        type: String,
        default: 'pending',
    },

    address: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        required: true,
    },

    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem", 
        required: true,
    }],
}, { timestamps: true }); 

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;