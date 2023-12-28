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
    category: {
        type: String,
        required: true,
    },
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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

//Export the model
module.exports = mongoose.model('Blog', blogSchema);