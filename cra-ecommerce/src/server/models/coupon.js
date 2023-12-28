/* Bảng database CÁC LOẠI MÃ GIẢM GIÁ (FREESHIP / DIS50% / 12.12 SIÊU SALE /.. ) */


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
    expiry: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Coupon', couponSchema);