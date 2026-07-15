const Store = require('../model/store.model');
const User = require('../model/user_model');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Product = require('../model/product.model');

// تجيب المتجر تبع المستخدم الحالي
const getMyStore = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const storeId = user.storeId;

        if (!storeId) {
            return res.status(400).json({
                success: false,
                message: "المستخدم ليس لديه متجر"
            });
        }

        const store = await Store.findById(storeId)
            .populate('vendorId', 'name email avatarUrl');

        if (!store) {
            return res.status(404).json({
                success: false,
                message: "المتجر غير موجود"
            });
        }

        if (store.vendorId._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "ليس لديك صلاحية لعرض هذا المتجر"
            });
        }

        res.status(200).json({
            success: true,
            store: store
        });
    } catch (error) {
        console.error('Error fetching store:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// تغير حالة المتجر (تفعيل/رفض) للأدمن بس
const updateStoreStatus = async (req, res) => {
    try {
        const { storeId } = req.params;
        const { status } = req.body;

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "ليس لديك صلاحية لتغيير الحالة"
            });
        }

        if (!['active', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "حالة غير صالحة. يجب أن تكون 'active' أو 'rejected'"
            });
        }

        const store = await Store.findById(storeId);
        if (!store) {
            return res.status(404).json({
                success: false,
                message: "المتجر غير موجود"
            });
        }

        store.status = status;
        await store.save();

        res.status(200).json({
            success: true,
            message: `تم ${status === 'active' ? 'الموافقة على' : 'رفض'} المتجر بنجاح`,
            store: store
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// تجيب المتاجر الي حالتها pending للأدمن
const getPendingStores = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "ليس لديك صلاحية لعرض هذه البيانات"
            });
        }

        const pendingStores = await Store.find({ status: 'pending' })
            .populate('vendorId', 'name email phone');

        res.status(200).json({
            success: true,
            stores: pendingStores
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// تجيب المتجر عن طريق معرف المنتج
const getStoreByProductId = async (req, res) => {
    try {
        const productId = req.params.productId;
        

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (!product.storeId) {
            return res.status(404).json({
                success: false,
                message: 'Product has no store'
            });
        }

        const store = await Store.findById(product.storeId);
        if (!store) {
            return res.status(404).json({
                success: false,
                message: 'Store not found'
            });
        }

        res.status(200).json({
            success: true,
            store: store
        });
    } catch (error) {
        console.error(' Error in getStoreByProductId:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};

// تجيب متجر عن طريق معرفه
const getStoreById = async (req, res) => {
    try {
        const storeId = req.params.id;
        const store = await Store.findById(storeId).populate('vendorId', 'name email');
        if (!store) {
            return res.status(404).json({ success: false, message: 'Store not found' });
        }
        res.status(200).json({ success: true, store });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// تنشئ متجر جديد
const createStore = async (req, res) => {
    try {
        const existingUser = await User.findById(req.user.id);
        if (existingUser.storeId) {
            return res.status(400).json({
                success: false,
                message: "لديك متجر بالفعل"
            });
        }

        const newStore = new Store({
            name: req.body.name,
            description: req.body.description,
            vendorId: req.user.id,
            logoUrl: req.body.logoUrl || null,
            coverUrl: req.body.coverUrl || null,
            status: 'pending',
        });

        const savedStore = await newStore.save();

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                storeId: savedStore._id,
                role: 'vendor',
            },
            { new: true }
        );

        const newToken = jwt.sign(
            {
                email: updatedUser.email,
                id: updatedUser._id,
                role: updatedUser.role,
                storeId: updatedUser.storeId,
            },
            process.env.JWT_SECRET,
            { expiresIn: '1w' }
        );

        return res.status(201).json({
            success: true,
            store: savedStore,
            token: newToken,
        });
    } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
    }
};

// تعدل بيانات المتجر
const updateStore = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "المستخدم غير موجود"
            });
        }

        if (user.role !== 'vendor' && user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "ليس لديك صلاحية لتعديل المتجر"
            });
        }

        const storeId = user.storeId;
        if (!storeId) {
            return res.status(400).json({
                success: false,
                message: "لا يوجد متجر لهذا المستخدم"
            });
        }

        const store = await Store.findById(storeId);
        if (!store) {
            return res.status(404).json({
                success: false,
                message: "المتجر غير موجود"
            });
        }

        if (store.vendorId.toString() !== user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: "ليس لديك صلاحية لتعديل هذا المتجر"
            });
        }

        const updatedStore = await Store.findByIdAndUpdate(
            storeId,
            {
                name: req.body.name || store.name,
                description: req.body.description || store.description,
                logoUrl: req.body.logoUrl || store.logoUrl,
                coverUrl: req.body.coverUrl || store.coverUrl,
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "تم تحديث المتجر بنجاح",
            store: updatedStore
        });
    } catch (error) {
        console.error('خطأ في تحديث المتجر:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// تجيب كل المتاجر 
const getAllStores = async (req, res) => {
    try {
        let filter = {};
        if (req.query.status) {
            filter = { status: req.query.status.split(',') };
        }
        const listStores = await Store.find(filter).populate('vendorId', 'name email');
        if (!listStores) {
            return res.status(404).json({ message: 'No stores found' });
        }
        res.status(200).json({ listStores, message: 'Stores found successfully' });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
};

module.exports = { createStore, getAllStores, updateStore, getStoreById, getMyStore, getStoreByProductId, getPendingStores, updateStoreStatus };