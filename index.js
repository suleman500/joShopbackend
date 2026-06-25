const express = require('express');
const connectDB = require('./config/db');
const app = express();
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
const apiPrefix = process.env.API_PREFIX || '/api';



// connect to database
connectDB();

//هون بدي اقول لابليكشن انه يستخدم البودي بارسر عشان يقدر يقرأ البيانات اللي جايه من الريكويست يعني اذا جايه بيانات من الفورم او من الجيسون يقدر يقرأها ويستخدمها في الابليكشن
app.use(bodyparser.json());
app.use(
     authJwt.unless({
        path: [
             `${apiPrefix}/users/login`,
             `${apiPrefix}/users/create`,
            // `${apiPrefix}/stores/create`,
             
            // بضيف امشاء الحساب 
]
    })
)
//app.use(authJwt);
// هون بدي اقول لابليكشن انه يستخدم الهاندلر عشان يقدر يتعامل مع الاخطاء اللي بتصير في الابليكشن يعني اذا صار خطأ في الابليكشن يقدر يطلع رسالة الخطأ للمستخدم


app.use(`${apiPrefix}/products`, productRoute);
 
app.use(`${apiPrefix}/users`, userRoute);
app.use(`${apiPrefix}/categories`, CategoryRoute);
app.use(`${apiPrefix}/stores`, StoreRoute);
app.use(`${apiPrefix}/order`, orderRoute);
app.use(errorHandler);
// شو 
 


app.get('/', (req, res) => {
    res.send('Hello World from Express!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
//app.use('/api/orders', orderRoute);