const BlogCategory = require('../models/blogCategory');
const asyncHandler = require('express-async-handler');

const createCategory = asyncHandler(async (req, res) => {
    const response = await BlogCategory.create(req.body);
    return res.json({
        success: response ? true : false,
        createdCategory: response ? response : 'Không thể tạo danh mục diễn đàn'
    });
})

const getCategories = asyncHandler(async (req, res) => {
    const response = await BlogCategory.find().select('title _id');
    return res.json({
        success: response ? true : false,
        blogCategories: response ? response : 'Không thể tìm danh mục diễn đàn'
    });
})

const updateCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params;
    const response = await BlogCategory.findByIdAndUpdate(bcid, req.body, { new: true })
    return res.json({
        success: response ? true : false,
        updatedCategory: response ? response : 'Không thể cập nhật danh mục diễn đàn'
    });
})

const deleteCategory = asyncHandler(async (req, res) => {
    const { bcid } = req.params;
    const response = await BlogCategory.findByIdAndDelete(bcid)
    return res.json({
        success: response ? true : false,
        deletedCategory: response ? response : 'Không thể xóa danh mục diễn đàn'
    });
})


module.exports = {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
}