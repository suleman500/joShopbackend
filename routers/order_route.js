const express = require('express');
const route = express.Router();
const authJwt = require('../helper/jwt');
const orderController = require('../controllers/order_control');

// إنشاء طلب جديد (لازم يكون المستخدم مسجل دخول)
route.post('/', authJwt, orderController.createOrder);

// جلب طلبات المستخدم الحالي (لصفحة "طلباتي")
route.get('/myorders', authJwt, orderController.getMyOrders);

// جلب طلب واحد بالتفصيل
route.get('/:id', authJwt, orderController.getOrderById);

// حذف طلب
route.delete('/:id', authJwt, orderController.deleteOrder);

module.exports = route;