const express = require('express');
const {Product}= require("../model/product.model");
const Category = require("../model/category.model");
 const {isAdmin,isAdminOrVendor,isCustomer,isVendor} = require('../helper/roleHelpers');
const route = express.Router();
const mongoose = require('mongoose');
const product = require('../model/product.model');
const productController = require('../controllers/product_controller');
const authJwt = require('../helper/jwt');





route.get('/',productController.ggetAllProduct );

// بدي اعمل المديل وير بشيك قبل ما اعمل اي تحرك هون 
route.post('/creat',authJwt,productController.createProduct );



route.get('/get/fav/:count', async (req, res) => {
 const count = req.params.count?req.params.count:0;
    const favProducts = await Product.find({ isFav: true }).limit(count);
    if (!favProducts) {
        return res.status(500).json({
            message: "no favorite products found"
        });
    }
    res.json({ "favProductst":favProducts })
}


);



route.delete('/delete/:id', authJwt, productController.deleteProduct);
route.get('/get/count', productController.countProduct );
route.put('/update/:id', authJwt, productController.updateProduct);
route.get('/:id', productController.getProductById);

    





module.exports = route;