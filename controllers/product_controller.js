const Product = require('../model/product.model');
const Store = require('../model/store.model');
const mongoose = require('mongoose');
const Favorite = require('../model/favorite.model');
const Category = require('../model/category.model');

// تجيب كل المنتجات مع فلتر حسب التصنيف اختياري
const ggetAllProduct = async (req, res) => {
    let filter = {};
    if (req.query.category) {
        filter = { category: req.query.category.split(',') };
    }
    const productList = await Product.find(filter).populate('category');
    if (!productList) {
        return res.status(404).json({
            message: "no products found"
        });
    }
    res.send(productList);
}

// تجيب منتجات المستخدم المفضلة
const getUserFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const favorites = await Favorite.find({ user: userId })
            .populate({
                path: 'product',
                populate: { path: 'category' }
            });
        const products = favorites.map(fav => fav.product);
        res.status(200).json({
            success: true,
            favorites: products,
            count: products.length
        });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// تجيب منتجات تصنيف معين
const getProductsByCategoryId = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const products = await Product.find({
            $or: [
                { category: categoryId },
                { "category._id": categoryId }
            ]
        }).populate('category');
        if (products.length === 0) {
            return res.status(404).json({
                success: false,
                message: "لا توجد منتجات في هذا التصنيف"
            });
        }
        res.status(200).json({
            success: true,
            count: products.length,
            products: products
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// تجيب منتج واحد بالمعرف
const getProductById = async (req, res) => {
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

// تضيف منتج جديد
const createProduct = async (req, res) => {
    try {
        const userId = req.user.id;
        const store = await Store.findOne({ vendorId: userId });
        if (!store) {
            return res.status(400).json({
                success: false,
                message: "is not Store"
            });
        }
        const newProduct = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            numberInStock: req.body.numberInStock,
            storeId: store._id,
            image: req.body.image,
            images: req.body.images,
            category: req.body.category,
        });
        const savedProduct = await newProduct.save();
        await Store.findByIdAndUpdate(store._id, {
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

// تبديل حالة المفضلة إضافة أو إزالة)
const toggleFavorite = async (req, res) => {
    try {
        const userId = req.user.id;
        const prodctId = req.params.id;
        const prodact = await Product.findById(prodctId);
        if (!prodact) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        const existFav = await Favorite.findOne({ user: userId, product: prodctId });
        if (existFav) {
            await Favorite.findByIdAndDelete(existFav._id);
            res.status(200).json({ success: true, message: "Product removed from favorites" });
        } else {
            const newFav = new Favorite({ user: userId, product: prodctId });
            await newFav.save();
            res.status(200).json({ success: true, message: "Product added to favorites", isFav: true });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// تحذف منتج بصلاحية الأدمن أو صاحب المتجر)
const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const userId = req.user.id;
        const userRole = req.user.role;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        let isAuthorized = false;
        if (userRole === 'admin') {
            isAuthorized = true;
        }
        if (!isAuthorized) {
            const store = await Store.findOne({ vendorId: userId });
            if (store && product.storeId.toString() === store._id.toString()) {
                isAuthorized = true;
            }
        }
        if (!isAuthorized) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this product"
            });
        }
        await Product.findByIdAndDelete(productId);
        const storeToUpdate = await Store.findById(product.storeId);
        if (storeToUpdate) {
            await Store.findByIdAndUpdate(storeToUpdate._id, {
                $inc: { productsCount: -1 }
            });
        }
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// تجيب منتجات متجر معين عن طريق storeId
const getProductsByStoreId = async (req, res) => {
    try {
        const storeId = req.params.storeId;
        const products = await Product.find({ storeId }).populate('category');
        res.status(200).json({
            success: true,
            products: products,
            count: products.length
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// تعدل بيانات منتج
const updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const storeId = req.user.storeId;
        const prodact = await Product.findById(productId);
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

// تجيب منتجات المتجر الخاص بالمستخدم
const getMyProducts = async (req, res) => {
    try {
        const storeId = req.user.storeId;
        if (!storeId) {
            return res.status(400).json({
                success: false,
                message: "ليس لديك متجر",
            });
        }
        const products = await Product.find({ storeId });
        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// تحسب عدد المنتجات الكلي
const countProduct = async (req, res) => {
    const productCount = await Product.countDocuments((count) => count);
    if (!productCount) {
        return res.status(500).json({
            message: "the product cannot be updated"
        });
    } else {
        res.status(200).json({
            productCount,
        });
    }
}

module.exports = {
    getProductById,
    createProduct,
    ggetAllProduct,
    updateProduct,
    countProduct,
    deleteProduct,
    getMyProducts,
    toggleFavorite,
    getProductsByCategoryId,
    getUserFavorites,
    getProductsByStoreId
};