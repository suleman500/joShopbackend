
const express = require('express');
const route = express.Router();
const userModel = require("../model/user_model");
const userController = require("../controllers/user_controller");
const authJwt = require('../helper/jwt');


route.post('/login', userController.loggin);

route.post('/create', userController.createUser);

route.get('/', userController.getAllUser);
route.get('/:id', userController.getUser); 
route.put('/update', authJwt,userController.updateUser);

module.exports = route;