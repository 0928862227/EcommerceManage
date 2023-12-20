const mongoose = require('mongoose'); 


var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, //auto loại bỏ dấu cách
    },
    //đường dẫn (slug)
    link: {
        type: String,
        required: true,
        // unique: true,
        lowercase: true,//viết thường 
    },
    size: {
        type:String,
    },
    description: {
        type: Array,
        required: true,
    },
    //nơi sản xuất sản phẩm
    brand: {
        type: String,
        required: true,
    },
    thumb: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    //loại sản phẩm 
    category: {
        type: String,
        required: true,
        type:mongoose.Types.ObjectId, //
        ref:'Category' //liên kết bảng
    },
    //số lượng
    quantity: {
        type: Number,
        default: 0,
    },
    //số lượng đã bán
    sold: {
        type: Number,
        default: 0,
    },
    images: {
        type: Array,
    },
    color: {
        type: String,
        require: true,
    },
    //đánh giá sản phẩm
    ratings: [
        {
            star: { type: Number },
            postedBy: { type: mongoose.Types.ObjectId, ref: 'User' },
            comment: { type: String }, //người vote để lại comment
            updatedAt: {
                type: Date,
            }
        },
    ],
    //số lượng người đánh giá
    totalRatings: {
        type: Number,
        default: 0,
    },
    variants: [
        {
            color: String,
            price: Number,
            thumb: String,
            images: Array,
            title: String,
            sku: String,
        }
    ]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);