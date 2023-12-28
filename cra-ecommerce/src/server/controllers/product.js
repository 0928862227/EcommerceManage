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

const getProducts = asyncHandler(async (req, res) => {
    // try {
    /* tham chiếu về cùng 1 ô nhưng tạo 2 data khác nhau
    chúng ta chỉ tương tác với object:queries thôi  */
    const queries = { ...req.query };

    //tách 4 elements of Products/trường hợp đặt biệt từ queries
    const excludeFields = ['limit', 'sort', 'page', 'fields'];

    /* xóa lần lượt các elements(el) ở trên trong object:queries
    còn req.query thì còn */
    excludeFields.forEach(el => delete queries[el]);

    /* định dạng /format lại các operators cho đóng cú pháp Mongoose [Video10-8:38]
    kiểu toán tử của mongoose phải có dấu $
        gte:lớn hơn hoặc bằng
        gt:lớn hơn
        lt:nhỏ hơn
        lte:nhỏ hơn hoặc bằng */
    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEL => `$${matchedEL}`);
    const formatedQueries = JSON.parse(queryString);
    let colorQueryObject = {}

    // Filtering : lọc sản phẩm theo điều kiện  (tìm theo tên/title/category/color)
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

    /* Sorting : lấy sản phẩm theo sự sắp xếp ,sắp xếp theo dấu ,
    Có thể đổi shortBy thành các collection khác : quantity ,title ,...
    Sắp xếp theo chiều tăng dần : quantity
    Sắp xếp theo chiều giảm dần : -quantity  */
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }


    /* Fields limiting:loại bỏ các collection không muốn hiện ra
    hoặc muốn hiển collection nào đó  */
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    /*Pagination : phân trang 
    limit : giới hạn số document được lấy về  
    skip : bỏ qua số document ,ko lấy về
    page : số trang có thển hiển thị được của fe gửi về hoặc mặc định là 1
    dấu + : convert dạng chuỗi ra dạng số */
    const page = +req.query.page || 1;
    const limit = +req.query.limit || +"${process.env.LIMIT_PRODUCTS}";
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    

    /* Hàm trả về kết quả hoặc err nếu có */
    try {
        const response = await queryCommand.exec();
        const counts = await Product.find(qr).countDocuments();

        return res.status(200).json({
            success: response ? true : false,
            'Số lượng sản phẩm tìm được ': counts,
            products: response ? response : 'Không tìm thấy bất kì sản phẩm nào!',
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
    
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

//---------------------------Đánh giá sản phẩm-----------------------\\
const ratings = asyncHandler(async (req, res) => {

    /* CHECK XEM NGƯỜI DÙNG ĐÃ MUA HÀNG THAY CHƯA! 
    const {idBill} = req.user;
    if(!idBill) throw new Error(`Bạn chưa mua hàng!`)
    const idProduct = await Product.findById(pid);
    const readyRating = idProduct?.idBill?.find(el => el.boughtBy.toString() === idBill);
    console.log({ readyRating });
    if (!readyRating) throw new Error(`Bạn chưa mua sản phẩm này!`)*/


    const { _id } = req.user;
    const { star, comment, pid, updatedAt } = req.body;
    if (!star || !pid) throw new Error(`Chưa tìm thấy mã sản phẩm`);

   
    const ratingProduct = await Product.findById(pid);
    const alreadyRating = ratingProduct?.ratings?.find(el => el.postedBy.toString() === _id);
    console.log({ alreadyRating });
    if (alreadyRating) {
        /* TH1 : NGƯỜI DÙNG MUỐN THAY ĐỔI ~CẬP NHẬT ĐÁNH GIÁ CŨ */ 
        await Product.updateOne({
            ratings: { $elemMatch: alreadyRating }
        }, {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment, "ratings.$.updatedAt": updatedAt }
        }, { new: true });
    } else {
        /* TH2 : NGƯỜI DÙNG BẮT ĐẦU ĐÁNH GIÁ */ 
        const response = await Product.findByIdAndUpdate(pid, {
            $push: { ratings: { star, comment, postedBy: _id, updatedAt } }
        }, { new: true });
        console.log(response)
    }

    // Điểm trung bình sao của sản phẩm
    const updatedProduct = await Product.findById(pid);
    const ratingCount = updatedProduct.ratings.length;
    const sumRatings = updatedProduct.ratings.reduce((sum, el) => sum + +el.star, 0);
    updatedProduct.totalRatings = Math.round(sumRatings * 10 / ratingCount) / 10;
    await updatedProduct.save();

    return res.status(200).json({
        success: !alreadyRating ? true : false,
        mes : !alreadyRating ? 'Đánh giá thành công!' : 'Đánh giá thất bại',
        updatedProduct
    })
})
/*
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
    ratings,
    /*uploadImgsPro,
    addVarriant*/
} 