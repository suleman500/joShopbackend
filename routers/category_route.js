const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category_controller');

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);
router.post('/', categoryController.createCategory);
router.put('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);
router.get('/get/count', categoryController.countCategory);

module.exports = router;