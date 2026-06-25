const mongoose = require('mongoose');




const { Schema } = mongoose;


const userSchema = new Schema({

    name: {
        type: String,
        required: true,
    },

    email: {
    
        required: true,
        type: String,
        unique: true,
        lowercase: true
    },
    password: {
        required: true,
        type: String,
        min: 9
    },
    phone: {
        type: String,
        required: true,
        unique: true,
       
    },

    role: {
        type: String,
        
        default: 'customer'  
    },

    // إضافات لتطابق نموذج Flutter
    avatarUrl: {
        type: String,
        default: null
    },

    storeId: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        default: null,
       

    },

    createdAt: {
        type: Date,
        default: Date.now
    }

})
// يعني اخذ يوزير سكيما وخنه في الكليكشن يوزير وهيكون عندي موديل اسمه يوزير موديل
const userModel = mongoose.model('User', userSchema);
// بعمله اكسبورت عشان اقدر استخدمه في اي مكان في الابليكشن
module.exports = userModel;