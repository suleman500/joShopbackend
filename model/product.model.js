const mongoose = require('mongoose');

const Category = require('./category.model');


const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
      default:0
    },
  
  image: {
    type: String,
    required: true
    },
  
    images: [{ type: String, }],

    category: {
        // هنا بنستخدم نوع خاص من المونقوز وهو objectId عشان نربط بين البرودكت والكتيجوري
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category' // هنا بنحدد اسم الموديل اللي بنربط بيه
    },
    // هنا بنستخدم نوع خاص من المونقوز وهو objectId عشان نربط بين البرودكت والبراند
    numberInStock: {
        type: Number,
       default:0,
        min: 0,
            max: 1000
    },
    date: {
        type: Date,
        default: Date.now,

  },
  isFav: {
    type: Boolean,
    default: false

    },
  
 
  storeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Store',
    default: null
  },

  // تقيم المنتج 
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },

  //  عدد التقييمات
  numOfReviews: {
    type: Number,
    default: 0,
    min: 0,
  },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;