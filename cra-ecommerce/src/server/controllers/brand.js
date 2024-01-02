/* CRUD THƯƠNG HIỆU (
    SỨC KHỎE : VMED ,Teco ,Omron ,TLP Medical ,...
    XE CỘ : Vinfas ,Toyota ,Mec ,BMW ,Lexus ,..
    THỜI TRANG : Vans ,Adidas ,Nike ,Levents ,Pop.pop ,...
    /.. ) 
*/

const Brand = require('../models/brand');
const asyncHandler = require('express-async-handler');


//-------------------Tạo thương hiệu------------------\\
const createBrand = asyncHandler(async (req, res) => {
    const response = await Brand.create(req.body);
    return res.json({
        success: response ? true : false,
        createdBrand: response ? response : 'Không thể tạo thương hiệu'
    });
})

//-------------------Lấy nhiều thương hiệu------------------\\
const getBrands = asyncHandler(async (req, res) => {
    const response = await Brand.find()
    const queries = { ...req.query };
    const counts = await Brand.find(queries).countDocuments();
    return res.json({
        success: response ? true : false,
        'Số lượng đã tạo: ' : counts,
        getBrands: response ? response : 'Không thể get thương hiệu'
    });
})

//-------------------Cập nhật thương hiệu------------------\\
const updateBrand = asyncHandler(async (req, res) => {
    const { brid } = req.params;
    const response = await Brand.findByIdAndUpdate(brid, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        updatedBrand: response ? response : 'Không thể cập nhật thương hiệu'
    });
})

//-------------------Xóa thương hiệu------------------\\
const deleteBrand = asyncHandler(async (req, res) => {
    const { brid } = req.params;
    const response = await Brand.findByIdAndDelete(brid)
    return res.json({
        success: response ? true : false,
        deletedBrand: response ? response : 'Không thể xóa thương hiệu'
    });
})


module.exports = {
    createBrand,
    getBrands,
    updateBrand,
    deleteBrand,
}