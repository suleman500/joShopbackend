 const Product = require('../model/product.model');
const Store = require('../model/store.model');
const mongoose = require('mongoose');



const ggetAllProduct = async (req, res) => {
     
     let filter ={};
     if (req.query.categories) {
 
         filter = { category: req.query.category.split(',') };
 
      }
     const productList = await Product.find(filter).populate('category');
     if(!productList){
         return res.status(404).json({
             message: "no products found"
         });
     }
     res.send(productList);
 
 
 
 }





const getProductById =  async (req, res) => {

    const productID = mongoose.isValidObjectId(req.params.id);
    if (!productID) {
        return res.status(500).json({
            message: "invalid product id"
        });
    }
    const productByid = await Product.findById(req.params.id);
    if (!productByid) { 
return res.status(400).json({
    message: "the product with the given id is not found"
});
    

    }

 }




const createProduct = async (req, res) => {
    try {
        const storeId = req.user.storeId;

        if (!storeId) {
            return res.status(400).json({
                success: false,
                message: "is not Store"
            });
        }

        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            numberInStock: req.body.numberInStock,
            storeId: storeId,
            image: req.body.image,
            images: req.body.images,
            category: req.body.category,
        });

        const savedProduct = await newProduct.save();

        await Store.findByIdAndUpdate(storeId, {
            $inc: { productsCount: 1 }
        });

        res.status(201).json({
            success: true,
            product: savedProduct,
            message: "the product is created successfully"
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message,
            message: "the product cannot be created"
        });
    }
};







const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id; 
        const storeId = req.user.storeId;

        const product = await Product.findById(productId); 

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "nott prodactt"
            });
        }

        if (product.storeId.toString() !== storeId) {
            return res.status(403).json({
                success: false,
                message: "No Acseeis prodact"
            });
        }

        await Product.findByIdAndDelete(productId);

        await Store.findByIdAndUpdate(storeId, {
            $inc: { productsCount: -1 }
        });

        res.status(200).json({
            success: true,
            message: "deleted prpdact succesfull"
        });
    } catch (error) {
        
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const updateProduct = async (req, res) => {
    try {
       const productId = req.params.id; 
        const storeId = req.user.storeId;
        const prodact= await Product.findById(productId);
        
        if (!prodact) {
            return res.status(404).json({
                success: false,
                message: "not funond prodact"
            });
        }
        
        if (prodact.storeId.toString() !== storeId) {
            return res.status(403).json({
                success: false,
                message: "not Accces is prodact"
            });
        }
        const updatedProduct = await Product.findByIdAndUpdate(productId,
            {
                name: req.body.name,
                description: req.body.description,
                price: req.body.price,
                numberInStock: req.body.numberInStock,
                image: req.body.image,
                images: req.body.images,
                category: req.body.category,
            },
            { new: true, }
        );
        if (!updatedProduct) {
            return res.status(500).json({
                message: "the product cannot be updated"
            });
        } else {
            res.status(200).json({
                success: true,
                updatedProduct,
                massage: "the product is updated successfully"
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


const countProduct = async (req, res) => { 
   
    // يعد عدد الديكيمن داخل الكليكشن 
    const productCount = await Product.countDocuments((count) => count);
    
 if (!productCount ) {
        return res.status(500).json({
            message: "the product cannot be updated"
        });
    }
    else {
        res.status(200).json({
           
           productCount , 
        });
    }

}


module.exports = {
getProductById,
createProduct,
ggetAllProduct,
   updateProduct ,
    countProduct,
deleteProduct
}

