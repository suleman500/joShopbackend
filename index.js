const express = require('express');
const connectDB = require('./config/db');
const app = express();
const path = require('path')
const port = process.env.PORT || 3000;
const userModel = require("./model/user_model");
const userRoute = require('./routers/user_route');
const productRoute = require('./routers/product_route');
const CategoryRoute = require('./routers/category_route');
//const orderRoute = require("./routers/order_route");
const orderRoute = require('./routers/order_route');
const StoreRoute = require('./routers/store_route');
const bodyparser = require('body-parser');
const authJwt = require('./helper/jwt');
const errorHandler = require('./helper/error_handler');
require('dotenv').config();
const apiPrefix = process.env.API_PREFIX ||'/api';



// connect to database
connectDB();

//هون بدي اقول لابليكشن انه يستخدم البودي بارسر عشان يقدر يقرأ البيانات اللي جايه من الريكويست يعني اذا جايه بيانات من الفورم او من الجيسون يقدر يقرأها ويستخدمها في الابليكشن
app.use(bodyparser.json());
// عشان الاشي يصير على الانتر نت مثل الصور 
// و الجوسن خليه استاتك  على السرفر و الجوين اسم الصوره 
//app.use(`${apiPrefix}/uploads`, express.static(path.join(__dirname, "uploads")));

app.use(`${apiPrefix}/uploads`, express.static(path.join(__dirname, "uploads")));


app.use(
     authJwt.unless({
        path: [
             `${apiPrefix}/users/login`,
            `${apiPrefix}/users/create`,
           `${apiPrefix}/products/creat`,
          
            // بضيف امشاء الحساب 
]
    })
)
//app.use(authJwt);
// هون بدي اقول لابليكشن انه يستخدم الهاندلر عشان يقدر يتعامل مع الاخطاء اللي بتصير في الابليكشن يعني اذا صار خطأ في الابليكشن يقدر يطلع رسالة الخطأ للمستخدم


app.use(`${apiPrefix}/products`,productRoute);
 
app.use(`${apiPrefix}/users`,userRoute);
app.use(`${apiPrefix}/categories`, CategoryRoute);
app.use(`${apiPrefix}/stores`, StoreRoute);
app.use(`${apiPrefix}/orders`, orderRoute);
app.use(errorHandler);
// شو 
 


app.get('/', (req, res) => {
    res.send('Hello World from Express!');
});
console.log('Uploads path:', path.join(__dirname, "uploads"));
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
//app.use('/api/orders', orderRoute);