/* Bảng database DANH MỤC SẢN PHẨM (SỨC KHỎE / ĐỜI SỐNG / THỜI TRANG /.. ) */

const mongoose = require('mongoose'); 

var productCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    brand: {
        type: Array,
        required: true,
        // unique: true,
    },
    image: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('ProductCategory', productCategorySchema);