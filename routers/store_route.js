const express = require('express');
const route = express.Router();
const Store = require('../model/store.model');
const authJwt = require('../helper/jwt'); 
const storeController = require('../controllers/store_controller');

route.get('/mystore', authJwt, storeController.getMyStore);
route.get('/pending-requests', authJwt, storeController.getPendingStores);
route.put('/update-status/:storeId', authJwt, storeController.updateStoreStatus);
route.get('/', authJwt, storeController.getAllStores);

route.get('/by-product/:productId', authJwt, storeController.getStoreByProductId);



route.get('/:id', authJwt, storeController.getStoreById);
route.post('/createStore', authJwt, storeController.createStore);
route.put('/updateStore', authJwt, storeController.updateStore);

module.exports = route;
