/* Bảng database CÁC LOẠI DIỄN ĐÀN (TẾT SIÊU SALE / SIÊU NHẬT / CUỐI NĂM /.. ) */


const mongoose = require('mongoose'); 

var blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    //liên kết bảng BlogCategory - Danh mục diễn đàn
    category: {
        type: String,
        required: true,
    },
    //Mã giảm giá
    coupon:{
        type: String,
        /* required: true, */
    },
    //Số lượt xem 
    numberViews: {
        type: Number,
        default: 0,
    },
    likes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    dislikes: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User'
        }
    ],
    // ảnh diễn đàn
    image: {
        type: String,
        default: 'https://beautifulthemes.com/blog/wp-content/uploads/2019/12/How-to-Hide-the-Featured-Image-in-WordPress-Posts.jpg',
    },
    author: {
        type: String,
        default: 'Admin',
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },//video13-10:00
    toObject: { virtuals: true },
});


module.exports = mongoose.model('Blog', blogSchema);