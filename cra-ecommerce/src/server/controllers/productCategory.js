const ProductCategory = require('../models/productCategory');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
    const response = await ProductCategory.create(req.body);
    return res.json({
        success: response ? true : false,
        createdCategory: response ? response : 'Không thể tạo Danh mục sản phẩm'
    });
})

const getCategories = asyncHandler(async (req, res) => {
    const response = await ProductCategory.find();
    return res.json({
        success: response ? true : false,
        'Các Danh mục sản phẩm': response ? response : 'Không thể tìm Danh mục sản phẩm'
    });
})

const updateCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findByIdAndUpdate(pcid, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        'Đã cập nhật danh mục ': response ? response : 'Không thể cập nhật Danh mục sản phẩm'
    });
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { pcid } = req.params;
    const response = await ProductCategory.findByIdAndDelete(pcid)
    return res.json({
        success: response ? true : false,
        'Danh mục đã xóa': response ? response : 'Không thể xóa Danh mục sản phẩm'
    });
})


module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
}