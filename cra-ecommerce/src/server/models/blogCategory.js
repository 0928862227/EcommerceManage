/* Bảng database DANH MỤC DIỄN ĐÀN (
    TẾT SIÊU SALE : FREESHIP ,DIS90% ,ƯU ĐÃI ĐỐI TÁC ,DÀNH RIÊNG CHO BẠN ,...
    SẮM SỬA ĐÓN TẾT : DIS70% ,MUA 1 TẶNG 1 ,....
    /.. ) 
*/


const mongoose = require('mongoose'); 

var blogCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('BlogCategory', blogCategorySchema);