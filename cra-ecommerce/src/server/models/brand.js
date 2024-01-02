/* Bảng database THƯƠNG HIỆU (
    SỨC KHỎE : VMED ,Teco ,Omron ,TLP Medical ,...
    XE CỘ : Vinfas ,Toyota ,Mec ,BMW ,Lexus ,..
    THỜI TRANG : Vans ,Adidas ,Nike ,Levents ,Pop.pop ,...
    /.. ) 
*/
    
const mongoose = require('mongoose'); 

var brandSchema = new mongoose.Schema({
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
module.exports = mongoose.model('Brand', brandSchema);