const mongoose = require('mongoose');
const Store = require('./store.model');

const { Schema } = mongoose;

const storeSchema = new Schema({

    // 
    name: {
        type: String,
        required: true,
        
    },

    // 
    description: {
        type: String,
        default: '',
    },

    // 
    logoUrl: {
        type: String,
        default: null,
    },

    // 
    coverUrl: {
        type: String,
        default: null,
    },

    // 
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },

    // تقيم
    productsCount: {
        type: Number,
        default: 0,
    },

   
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },

    
    createdAt: {
        type: Date,
        default: Date.now,
    },

});

const storeModel = mongoose.model('Store', storeSchema);
module.exports = storeModel;