const userModel = require('../model/user_model');
const userController = require('../controllers/user_controller');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// تعديل بيانات المستخدم الحالي (باستثناء الباسورد والصلاحيا)
const updateCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "المستخدم غير موجود"
            });
        }

        // الحقول المسموح بتعديلها
        const allowedUpdates = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            avatar: req.body.avatar,
        };

        Object.keys(allowedUpdates).forEach(key => {
            if (allowedUpdates[key] !== undefined) {
                user[key] = allowedUpdates[key];
            }
        });

        await user.save();
        const updatedUser = await userModel.findById(userId).select("-password");

        res.status(200).json({
            success: true,
            message: "تم تحديث البيانات بنجاح",
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// إنشاء مستخدم جديد (تسجيل)
const createUser = async (req, res) => {
    const newUser = new userModel({
        name: req.body.name,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email,
        phone: req.body.phone,
        storeId: req.body.storeId || null,
        avatarUrl: req.body.avatarUrl || null,
        createdAt: Date.now(),
        role: req.body.role
    });
    newUser.save().then((creatUser) => {
        return res.status(201).json(creatUser);
    }).catch((err) => {
        return res.status(400).json({
            message: err.message
        });
    });
};

// تسجيل الدخول
const loggin = async (req, res) => {
    const userr = await userModel.findOne({ email: req.body.email });
    console.log('📦 userr.storeId:', userr.storeId);
    if (!userr) {
        return res.status(404).json({
            message: "no user found, please register"
        });
    }
    if (userr && bcrypt.compareSync(req.body.password, userr.password)) {
        const seceret = process.env.JWT_SECRET;
        const token = jwt.sign(
            {
                email: userr.email,
                id: userr._id,
                role: userr.role,
                storeId: userr.storeId,
            },
            seceret,
            {
                expiresIn: "1w",
            },
        );
        return res.status(200).json({
            message: `login success ${userr.name}`,
            id: userr._id,
            name: userr.name,
            email: userr.email,
            role: userr.role,
            storeId: userr.storeId,
            token: token
        });
    } else {
        return res.status(400).json("wrong password");
    }
};

// جيب بيانات المستخدم الحالي (من التوكن)
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const currentUser = await userModel.findById(userId).select("-password");
        if (!currentUser) {
            return res.status(404).json({
                message: "no user found"
            });
        }
        console.log(userId);
        return res.status(200).json(currentUser);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

// جلب كل المستخدمين (بدون باسورد)
const getAllUser = async (req, res) => {
    const usersList = await userModel.find().select("-password");
    return res.status(200).json(usersList);
};

// جلب مستخدم واحد بواسطة المعرف
const getUser = async (req, res) => {
    const user = await userModel.findById(req.params.id).select("-password");
    if (!user) {
        return res.status(404).json({
            message: "no user found"
        });
    }
    return res.status(200).json(user);
};

module.exports = { createUser, getAllUser, getUser, loggin, getCurrentUser, updateCurrentUser };