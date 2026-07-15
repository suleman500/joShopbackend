const express = require('express');
const {Product}= require("../model/product.model");
const Category = require("../model/category.model");
 const {isAdmin,isAdminOrVendor,isCustomer,isVendor} = require('../helper/roleHelpers');
const route = express.Router();
const mongoose = require('mongoose');
const product = require('../model/product.model');
const productController = require('../controllers/product_controller');
const authJwt = require('../helper/jwt');
const upload = require('../helper/uploads');





route.get('/allproducts',authJwt ,productController.ggetAllProduct)

// بدي اعمل المديل وير بشيك قبل ما اعمل اي تحرك هون 
route.post('/creat', authJwt, productController.createProduct );
route.put('/togglefavorite/:id', authJwt, productController.toggleFavorite);
route.get('/favorites', authJwt, productController.getUserFavorites)

route.delete('/delete/:id', authJwt, productController.deleteProduct);
route.get('/get/count', authJwt, productController.countProduct );
route.put('/update/:id', authJwt, productController.updateProduct);
route.get('/myProduct', authJwt, productController.getMyProducts );
route.get('/:id', authJwt, productController.getProductById);
route.get('/productcategoryId/:categoryId', authJwt, productController.getProductsByCategoryId);

route.get('/by-store/:storeId', authJwt, productController.getProductsByStoreId);

route.post('/uploades', upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'لم يتم رفع صورة' });
    }
    res.json({
        image: req.file.filename,
    });
});

//route.post('/uploads',productController.)



    





module.exports = route;