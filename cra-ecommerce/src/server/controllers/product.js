//const { response } = require('express')
const Product = require('../models/product')
const asyncHandler = require('express-async-handler')
const slugify = require('slugify')
//const makeSKU = require('uniqid') 

//-----------------Tạo sản phẩm--------------------\\
const createProduct = asyncHandler(async (req, res) => {
    const { title, price, description, brand, category, color, size } = req.body;
    const thumb = req?.files?.thumb[0]?.path
    const images = req.files?.images?.map(el => el.path)
    if (!(title && price && description && brand && category && color && size)) throw new Error('Chưa nhập đủ thông tin     !')
    req.body.slug = slugify(title) //video9-20:49
    if (thumb) req.body.thumb = thumb
    if (images) req.body.images = images
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        mes: newProduct ? 'Tạo sản phẩm thành công' : 'Tạo sản phẩm thất bại'
    })
})

//-----------------Hàm get 1 sản phẩm bất kì bằng id --------------------\\
const getProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const product = await Product.findById(pid).populate({
        path: 'ratings',
        populate: {
            path: 'postedBy',
            select: 'firstname lastname avatar'
        }
    })
    return res.status(200).json({
        success: product ? true : false,
        productData: product ? product : 'Không tìm thấy sản phẩm!'
    })
})

//-----------------Hàm get nhiều sản phẩm bất kì --------------------------\\
// Filtering, sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
    // try {
    const queries = { ...req.query };
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEL => `$${matchedEL}`);
    const formatedQueries = JSON.parse(queryString);
    let colorQueryObject = {}

    // Filtering : lọc sản phẩm theo điều kiện
    if (queries?.title) formatedQueries.title = { $regex: queries.title, $options: 'i' };
    if (queries?.category) formatedQueries.category = { $regex: queries.category, $options: 'i' };
    // if (queries?.color) formatedQueries.color = { $regex: queries.color, $options: 'i' };
    if (queries?.color) {
        delete formatedQueries.color
        const colorArr = queries.color.split(',')
        const colorQuery = colorArr.map(el => ({ color: { $regex: el, $options: 'i' } }))
        colorQueryObject = { $or: colorQuery }
    }
    let queryObject = {}
    if (queries?.q) {
        delete formatedQueries.q
        queryObject = {
            $or: [
                { color: { $regex: queries.q, $options: 'i' } },
                { title: { $regex: queries.q, $options: 'i' } },
                { category: { $regex: queries.q, $options: 'i' } },
                { brand: { $regex: queries.q, $options: 'i' } },
                // { description: { $regex: queries.q, $options: 'i' } },
            ]
        }

    }

    const qr = { ...colorQueryObject, ...formatedQueries, ...queryObject }
    let queryCommand = Product.find(qr);

    // Sorting : lấy sản phẩm theo sự sắp xếp
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    // Fields limiting : phân trang
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    // const response = await queryCommand.exec();
    // const counts = await Product.countDocuments(q);

    // queryCommand.exec(async (err, response) => {
    //     if (err) throw new Error(err.message);
    //     const counts = await Product.find(q).countDocuments();
    //     return res.status(200).json({
    //         success: response ? true : false,
    //         counts,
    //         products: response ? response : 'Cannot get products',
    //     });
    // })
    try {
        const response = await queryCommand.exec();
        const counts = await Product.find(qr).countDocuments();

        return res.status(200).json({
            success: response ? true : false,
            counts,
            products: response ? response : 'Cannot get products',
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
    // return res.status(200).json({
    //     success: response ? true : false,
    //     counts,
    //     products: response ? response : 'Cannot get products',
    // });
    // } catch (err) {
    //     return res.status(500).json({ success: false, error: err.message });
    // }
});

//-----------------------Hàm chỉnh sửa thông tin sản phẩm .dành cho Admin-------------------\\

const updateProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const files = req?.files
    if (files?.thumb) req.body.thumb = files?.thumb[0]?.path
    if (files?.images) req.body.images = files?.images?.map(el => el.path)
    if (req.body && req.body.title) req.body.slug = slugify(req.body.title)
    const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, { new: true })
    return res.status(200).json({
        success: updatedProduct ? true : false,
        mes: updatedProduct ? 'Chỉnh sửa sản phẩm thành công!' : 'Không thể chỉnh sửa sản phẩm!'
    })
})

//--------------------------Hàm xóa sản phẩm , dành cho Admin-------------------------\\
const deleteProduct = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const deletedProduct = await Product.findByIdAndDelete(pid)
    return res.status(200).json({
        success: deletedProduct ? true : false,
        mes: deletedProduct ? 'Xóa sản phẩm thành công' : 'Không thể xóa sản phẩm'
    })
})

/*
const ratings = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    const { star, comment, pid, updatedAt } = req.body;
    if (!star || !pid) throw new Error(`Missing inputs`);
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id);
    console.log({ alreadyRating });
    if (alreadyRating) {
        // update star & cmt
        await Product.updateOne({
            ratings: { $elemMatch: alreadyRating }
        }, {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment, "ratings.$.updatedAt": updatedAt }
        }, { new: true });
    } else {
        // add star & cmt
        const response = await Product.findByIdAndUpdate(pid, {
            $push: { ratings: { star, comment, postedBy: _id, updatedAt } }
        }, { new: true });
        console.log(response)
    }

    // Sum satings
    const updatedProduct = await Product.findById(pid);
    const ratingCount = updatedProduct.ratings.length;
    const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0);
    updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10;
    await updatedProduct.save();

    return res.status(200).json({
        success: true,
        updatedProduct
    })
})

const uploadImgsPro = asyncHandler(async (req, res) => {
    const { pid } = req.params;
    if (!req.files) throw new Error('Missing inputs');
    const response = await Product.findByIdAndUpdate(pid, { $push: { images: { $each: req.files.map(el => el.path) } } }, { new: true });
    console.log(req.files);
    return res.status(200).json({
        success: response ? true : false,
        updatedProduct: response ? response : 'Cannot upload images product'
    })
})


const addVarriant = asyncHandler(async (req, res) => {
    const { pid } = req.params
    const { title, price, color } = req.body
    const thumb = req?.files?.thumb[0]?.path
    const images = req.files?.images?.map(el => el.path)
    if (!(title && price && color)) throw new Error('Missing inputs')
    const response = await Product.findByIdAndUpdate(pid, {
        $push: {
            variants: { color, price, title, thumb, images, sku: makeSKU().toUpperCase() }
        }
    }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Thêm biến thể thành công' : 'Cannot upload images product'
    })
})*/
module.exports = {
    createProduct,
    getProduct,
    getProducts,
    updateProduct,
    deleteProduct,
   /* ratings,
    uploadImgsPro,
    addVarriant*/
} 