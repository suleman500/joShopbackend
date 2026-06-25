
const express = require('express');
const route = express.Router();
const orderController = require('../controllers/order_control');




route.post('/', orderController.createOrder);
module.exports = route;
