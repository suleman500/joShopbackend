// models/order.model.js

const mongoose = require('mongoose'); 
const OrderItem = require('./orderItem');

const orderSchema = mongoose.Schema({ 

    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },

    totalPrice: {
        type: Number,
        required: true,
    },
// حالت الطلب 
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
        ref: "Order",
        require: true
    }]

});

const Order = mongoose.model('Order', orderSchema); 

module.exports = Order;