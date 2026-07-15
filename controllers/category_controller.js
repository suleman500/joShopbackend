const Category = require('../model/category.model');
const mongoose = require('mongoose');

// تجيب كل التصنيفات من قاعدة البيانات
const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find().select('_id name image');
        if (!categories || categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "no categories found"
            });
        }
        res.status(200).json({
            success: true,
            categories: categories,
            message: "Categories fetched successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// تجيب تصنيف واحد عن طريق رقمه
const getCategoryById = async (req, res) => {
    try {
        const categoryId = mongoose.isValidObjectId(req.params.id);
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "invalid category id"
            });
        }
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "category not found"
            });
        }
        res.status(200).json({
            success: true,
            category: category
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// تضيف تصنيف جديد
const createCategory = async (req, res) => {
    try {
        const { name, image } = req.body;
        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }
        const newCategory = new Category({ name, image: image || '' });
        const savedCategory = await newCategory.save();
        res.status(201).json({
            success: true,
            category: savedCategory,
            message: "Category created successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message,
            message: "Category cannot be created"
        });
    }
};

// تعدل بيانات تصنيف
const updateCategory = async (req, res) => {
    try {
        const categoryId = mongoose.isValidObjectId(req.params.id);
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "invalid category id"
            });
        }
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name, image: req.body.image },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "category not found"
            });
        }
        res.status(200).json({
            success: true,
            category: updatedCategory,
            message: "Category updated successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// تحذف تصنيف
const deleteCategory = async (req, res) => {
    try {
        const categoryId = mongoose.isValidObjectId(req.params.id);
        if (!categoryId) {
            return res.status(400).json({
                success: false,
                message: "invalid category id"
            });
        }
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "category not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Category deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// تحسب عدد التصنيفات الكلي
const countCategory = async (req, res) => {
    try {
        const count = await Category.countDocuments();
        res.status(200).json({
            success: true,
            categoryCount: count
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    countCategory
};