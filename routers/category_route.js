const express = require('express');
const route = express.Router()
const Category = require("../model/category.model");




route.get('/', async (req, res) => {

    const categoryList = await Category.find();



    if (!categoryList) {
        return res.status(404).json({
            message: "no category found"
        })
   
    }


    else {
        res.send({ categoryList, massage: "the category is found successfully" });
        
}






});



route.post('/', (req, res) => {

    const newCategory = new Category({
        name: req.body.name,
        image: req.body.image,
       
    });
    newCategory.save().then((createdCategory) => {
        if (!createdCategory) {
            return res.status(404).json({
                message: "the category cannot be created"
            });
        }
        else {
            res.status(201).json({
                success: true,
                createdCategory, massage: "the category is created successfully"
            });
        }




    }).catch((err) => {
        res.status(400).json({
            success: false,
            error: err,
            message: "the category cannot be created"
        });
    });



});

module.exports = route;
