

const jwt = require('jsonwebtoken');


const {unless} = require('express-unless');







function authJwt(req, res, next) { 
    //هون يعني جبنا التوكن 
    const authHeaders = req.headers.authorization;
    if (!authHeaders) {
     return   res.status(401).json({
       'message': "no token provided"
   }) 

    }
    try {
// عشان اطلع التوكن بعملت اسبليت يعني بعد الفاصله بدي التوكن 
        const token = authHeaders.split(' ')[1];
        // هون بتحقق من التوكن اذا كان صحيح او لا يعني اذا كان التوكن اللي جاي معي هو نفسه اللي انا عاملها سيكريت كي
        const user = jwt.verify(token, process.env.JWT_SECRET);
        // اذا كان التوكن صحيح بدي اخزن اليوزر في الريكويست عشان اقدر استخدمه في اي مكان في الابليكشن
        req.user = user;
        // اذا كان التوكن صحيح بدي اكمل الطلب يعني اعطيه الفرصة انه يدخل على الصفحة اللي بده ايها ا
        next();

     }
    catch (error) { 

      return    res.status(401).json({
       'message': "invalid token"
   }) 

    }



}
//Bearer token in the header

// هون استعمل البكج فوق 
// هون بدي اعمل استثناء يعني اذا كان اليوزر بده يدخل على صفحة تسجيل الدخول او تسجيل مستخدم جديد ما بدي اعمل له التحقق من التوكن
authJwt.unless = unless;

module.exports = authJwt;