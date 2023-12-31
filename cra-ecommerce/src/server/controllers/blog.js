const Blog = require('../models/blog');
const asyncHandler = require('express-async-handler');


//----------------------Tạo 1 diễn đàn -----------------\\
const createNewBlog = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body;
    if (!title || !description || !category) throw new Error('Thíếu thông tin');
    const response = await Blog.create(req.body);
    return res.json({
        success: response ? true : false,
        createdBlog: response ? response : 'Không thể tạo diễn đàn'
    });
})


//--------------Sửa các thông tin của diễn đàn---------------\\
const updateBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (Object.keys(req.body).length === 0) throw new Error('Thiếu dữ liệu');
    const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
    return res.json({
        success: response ? true : false,
        createdBlog: response ? response : 'Không thể cập nhật diễn đàn'
    });
})


//-----------------tìm nhiều diễn đàn---------------\\
const getBlogs = asyncHandler(async (req, res) => {
    const response = await Blog.find();
    return res.json({
        success: response ? true : false,
        createdBlog: response ? response : 'Không thể tìm diễn đàn'
    });
})


//--------------------thả like diễn đàn--------------\\
const likeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) throw new Error('Thiếu id của diễn đàn!');

    const blog = await Blog.findById(bid);
    const alreadyDisliked = blog?.dislikes?.find(el => el.toString() === _id);
    if (alreadyDisliked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            rs: response,
        });
    }
    const isLiked = blog?.likes?.find(el => el.toString() === _id);
    if (isLiked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            rs: response,
        });
    } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { likes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            rs: response,
        });
    }
})

//------------------Thả dislike diễn đàn------------\\
const dislikeBlog = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { bid } = req.params;
    if (!bid) throw new Error('Thíu id diễn đàn!');
    const blog = await Blog.findById(bid);
    const alreadyliked = blog?.likes?.find(el => el.toString() === _id);
    if (alreadyliked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { likes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            rs: response,
        });
    }
    const isDisliked = blog?.dislikes?.find(el => el.toString() === _id);
    if (isDisliked) {
        const response = await Blog.findByIdAndUpdate(bid, { $pull: { dislikes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            rs: response,
        });
    } else {
        const response = await Blog.findByIdAndUpdate(bid, { $push: { dislikes: _id } }, { new: true });
        return res.json({
            success: response ? true : false,
            rs: response,
        });
    }
})
//vid14-26:11 - Hiển thị số người like diễn đàn 
const excludeFields = '-refreshToken -password -mobile -role -createdaAt -updatedAd';
//-----------------tìm diễn đàn---------------\\
const getBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;

    //const blog = await Blog.findById(bid).populate('likes', excludeFields).populate('dislikes', excludeFields);

    /* tính luôn số lượt view khi hàm này được gọi 
    inc: là tăng lên 1 */
    const blog = await Blog.findByIdAndUpdate(bid, { $inc: { numberViews: 1 } }, { new: true })
        .populate('likes', 'firstname lastname')
        .populate('dislikes', 'firstname lastname');
    return res.json({
        success: blog ? true : false,
        rs: blog,
    });
})

//------------------Xóa diễn đàn------------------------\\
const deleteBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    const blog = await Blog.findByIdAndDelete(bid)
    return res.json({
        success: blog ? true : false,
        //rs: blog,
        deletedBlog: blog || 'Có gì đó không ổn!!!',
    })
})

//---------------------Tải ảnh diễn đàn------------------\\
const uploadImgBlog = asyncHandler(async (req, res) => {
    const { bid } = req.params;
    if (!req.file) throw new Error('Chưa nhận được file ảnh');
    const response = await Blog.findByIdAndUpdate(bid, { image: req.file.path }, { new: true });
    console.log(req.file);
    return res.status(200).json({
        status: response ? true : false,
        updatedBlog: response ? response : 'Không thể tải ảnh diễn đàn'
    })
})
module.exports = {
    createNewBlog,
    updateBlog,
    getBlogs,
    likeBlog,
    dislikeBlog,
    getBlog,
    deleteBlog,
    uploadImgBlog
}