/* Bảng database CÁC LOẠI PHIẾU MUA GIẢM GIÁ 
(FREESHIP / DIS50% / 12.12 SIÊU SALE /.. ) */


const mongoose = require('mongoose'); 

var couponSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
    },
    discount: {
        type: String,
        required: true,
    },
    discription:{
        type: String,
    },
    expiry: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Coupon', couponSchema);