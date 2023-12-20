const Sales = require('../models/sales');
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const crypto = require('crypto');
const Product = require('../models/product')
const slugify = require('slugify')



/* 
const makeToken = require('uniqid');
const { Saless } = require('../ultils/contants') */

//----------ĐĂNG KÝ-TẠO TÀI KHOẢN-----------//

 const register = asyncHandler(async (req, res) => {
     const { email, password, firstname, lastname, businessNumber, agentCode, } = req.body;
     if (!email || !password || !firstname || !lastname || !businessNumber || !agentCode)
         return res.status(400).json({
             success: false,
            mes: 'Thiếu thông tin'
        })

     const sales = await Sales.findOne({ businessNumber });
     if (sales)
         throw new Error('Tài khoản này đã tồn tại');
   else {
         const newSales = await Sales.create(req.body);
         return res.status(200).json({
             success: newSales ? true : false,
             mes: newSales ? 'Đăng ký thành công ! Hãy đăng nhập ' : 'Có sai sót gì đó .Hãy thử lại sau'
      })
     }
})
/* const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body
    /* catch bug reques api 
    check collections in models/Sales.js have reques 
    if eny thís collection have no reques 
    then check will detect and not query database /video2- */ 
   /* if (!email || !password || !lastname || !firstname || !mobile)
        return res.status(400).json({
            success: false,
            mes: 'Thiếu thông tin'
        })
    const response = await Sales.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        response
    })
  })
  /* check email này đã được register hay chưa và nạp thông tin mới */
   /* const Sales = await Sales.findOne({ email });
    if (Sales)
        throw new Error('Tài khoản này đã tồn tại');
    else {
        const token = makeToken();
        // res.cookie('dataregister', { ...req.body, token }, { httpOnly: true, maxAge: 15 * 60 * 1000 })
        // const html = `xin vui lòng click vào link dưới đây để hoàn tất quá trình đăng ký.Link này sẽ hết hạn sau 15 phút kể từ bây giờ.
        //     <a href = ${process.env.URL_SERVER}/api/Sales/final-register/${token}>click here</a > `
        const emailedited = btoa(email) + '@' + token
        const newSales = await Sales.create({
            email: emailedited, password, firstname, lastname, mobile
        })
        if (newSales) {
            const html = `<h2>Register code:</h2><br/><blockquote>${token}</blockquote>`
            await sendMail({ email, html, subject: 'Confirm register account' })
        }
        setTimeout(async () => {
            await Sales.deleteOne({ email: emailedited })
        }, [300000])
        return res.json({
            success: newSales ? true : false,
            mes: newSales ? 'Please check your email to active your account' : 'Something went wrong, pls try again'
        })
    }
*/
//----------ĐĂNG NHẬP-----------\\

// Refresh token => Cấp mới access token
// Access token => Xác thực người dùng, quân quyên người dùng
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(400).json({
            success: false,
            mes: 'Chưa nhập email hoặc mật khẩu!'
        })
    /*  tìm email này trong data coi thử có không?
    Nếu email này có tồn tại thì tiếp tục check tới pw có tồn tại hay không?
    models/Sales(v4.22:01) */
    const response = await Sales.findOne({ email }) //25:26 v4 
    // khi đăng nhập thành công
    if (response && await response.isCorrectPassword(password)) {
          /* ẩn thông tin quan trọng như password và role ra khỏi bảng body 
         trên postman và sau này gửi nó về clent để hiển thị trên Sales */
        const { password, role, refreshToken, ...SalesData } = response.toObject()

        // Tạo access token khi login
        const accessToken = generateAccessToken(response._id, role)

        // Tạo refresh token khi token ở trên hết hạn
        const newRefreshToken = generateRefreshToken(response._id)
         // Lưu refresh token vào database
        await Sales.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        // Lưu refresh token vào cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        //đăng nhập thành công thì.. */
        return res.status(200).json({
            success: true,
            accessToken,
            SalesData
        })
        //đăng nhập thất bại 
    } else {
        throw new Error('Password không đúng hoặc email không tồn tại!')
    }
})

//---------------Lấy thông tin hiện tại của Sales---------------\\

const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.Sales
    //ko hiển thị 3 tt role ,password,..
    const Sales = await Sales.findById(_id).select('-refreshToken -password -role')
    /* .populate({
        path: 'cart',
        populate: {
            path: 'product',
            select: 'title thumb price'
        } 
    })*/
    return res.status(200).json({
        success: Sales ? true : false,
        rs: Sales ? Sales : 'Không tìm thấy thông tin Sales'
    })
})


//-------Tạo accessToken mới khi refreshToken vẫn còn hạn-------\\

const refreshAccessToken = asyncHandler(async (req, res) => {
    // Lấy token từ cookies
    const cookie = req.cookies
    // Check xem có token hay không
    if (!cookie && !cookie.refreshToken) throw new Error('Không tìm thấy refreshToken trong cookie')
    // Check token có hợp lệ hay không
    const rs = await jwt.verify(cookie.refreshToken, "${process.env.JWT_SECRET} ")
    // check xem refreshToken có khớp với refreshToken đã lưu trong db hay k?
    const response = await Sales.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token không khớp!'
    })
})

//----------------ĐĂNG XUẤT---------------------\\

const logout = asyncHandler(async (req, res) => {
    //check xem Sales đang ở trạng thái đăng nhập hay không?
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) 
    throw new Error('Không có refreshToken trong cookie! Nếu đăng xuất thì lần sau phải đăng nhập lại!!')
    // Xóa refresh token trong db
    await Sales.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
    // Xóa refresh token ở cookie trình duyệt
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    return res.status(200).json({
        success: true,
        mes: 'Đã đăng xuất'
    })
})

// Client gửi email
// Server check email có hợp lệ hay không => Gửi mail + kèm theo link (password change token)
// Client check mail => click link
// Client gửi api kèm token
// Check token có giống với token mà server gửi mail hay không
// Change password

//------------------------Xác thực người dùng để đổi mật khẩu-----------------\\

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body
    if (!email) throw new Error('Chưa có email')
    const Sales = await Sales.findOne({ email })
    if (!Sales) throw new Error('Không tìm thấy người dùng')
    const resetToken = Sales.createPasswordChangedToken()
    await Sales.save()
    const{ firstname } = req.body



    //------------------------Custom nội dung emailResetPassword----------------\\

    const html = `
    <div  style="font-family: Verdana;margin: 0;padding: 0;max-width: 600px; margin: 0 auto;background: linear-gradient(45deg, #3533cd, #090a0b);
    padding: 20px;font-size: 15px;font-weight: 500;line-height: 1.6;color: aliceblue;border: 2px solid #ffffff; border-radius: 10px; 
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2); "
    >
        <div class="content">
            <h1 class="logo" style="color: #58eaf8;font-family: "YACgEcnJpjs 0";
            font-size: 50px;letter-spacing: -0.094em;" ><span>Ecom .</span></h1>
            <h3 style="color: #ffffff;
            border-bottom: 1px solid #ffffff; 
            padding-bottom: 5px;"></h3>
            <p>Xin Chào ${firstname},</p>
            <p>Chúng tôi nhận được yêu cầu kích hoạt mật khẩu cho tài khoản của bạn. Để hoàn tất quá trình này, vui lòng ấn vào liên kết dưới đây:</p>
            <a class="button" style="display: block;
            margin:0 31%;
            padding: 10px 20px;
            border-radius: 5px;
            background-color: #ffffff;
            color: #090a0b;
            font-weight: 600; 
            
            text-decoration: none;
            text-align: center; "
            href="http://localhost:8888/Sales/api/reset-password/${resetToken}" >Kích Hoạt Mật Khẩu</a>
            <p>Nếu bạn không yêu cầu việc này, vui lòng bỏ qua email này. Liên kết sẽ hết hạn sau 15 phút kể từ khi bạn nhận được email.</p>
            <p>Trân trọng,</p>
            <h3 style="color: #ffffff;
            border-bottom: 1px solid #ffffff; 
            padding-bottom: 5px;"
            ></h3>
            <p class="footer" style="display: block;
            font-family: Lexend Deca;
            margin:0 30%;
            padding: 10px 20px;
            text-align: center;
            font-size: 10px;
            margin-top: 20px;
            padding-top: 10px;">
                Copyright © 2023 Ecom, All rights reserved.

                Floor 3, 480/58 Ly Thai To Street,  Dictrist 10,   
                 Ho Chi Minh City</p>
         </div>
    </div>

</body>

     `
    //-------------------------Gửi mail ---------------------\\

    const data = {
        firtname,
        email,
        html,
        subject: "Kích Hoạt Mật Khẩu Tài Khoản Của Bạn"
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: rs.response?.includes('OK') ? true : false,
        mes: rs.response?.includes('OK') ? 'Hãy kiểm tra mail của bạn (check spam/rác/quảng cáo)' : 'Có gì đó không ổn !Hãy thử lại sau'
    })
})

//-----------------------Xử lí button 'kích hoạt mật khẩu' trong mail--------------\\
const resetPassword = asyncHandler(async (req, res) => {
    const { password, token } = req.body
    if (!password || !token) throw new Error('Chưa có thông tin ')
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
    const Sales = await Sales.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } }) //so sánh
    if (!Sales) throw new Error('Reset Token chưa hợp lệ hoặc đã hết hạn!')
    Sales.password = password
    Sales.passwordResetToken = undefined //xóa
    Sales.passwordChangedAt = Date.now()
    Sales.passwordResetExpires = undefined
    await Sales.save()
    return res.status(200).json({
        success: Sales ? true : false,
        mes: Sales ? 'Cập nhật mật khẩu thành công' : 'Có gì đó không ổn! Hãy thử lại sau.'
    })
})

//---------------------Hàm lấy thông tin tất cả Sales ,dành cho admin-----------------\\
const getSaless = asyncHandler(async (req, res) => {
    const queries = { ...req.query };
    const excludeFields = ['limit', 'sort', 'page', 'fields'];
    excludeFields.forEach(el => delete queries[el]);

    let queryString = JSON.stringify(queries);
    queryString = queryString.replace(/\b(gte|gt|lt|lte)\b/g, matchedEL => `$${matchedEL}`);
    const formatedQueries = JSON.parse(queryString);

    // Filtering
    if (queries?.name) formatedQueries.name = { $regex: queries.name, $options: 'i' };
    if (req.query.q) {
        delete formatedQueries.q
        formatedQueries['$or'] = [
            { firstname: { $regex: req.query.q, $options: 'i' } },
            { lastname: { $regex: req.query.q, $options: 'i' } },
            { email: { $regex: req.query.q, $options: 'i' } },
        ]
    }
    let queryCommand = Sales.find(formatedQueries);

    // Sorting
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        queryCommand = queryCommand.sort(sortBy);
    }

    // Fields limiting
    if (req.query.fields) {
        const fields = req.query.fields.split(',').join(' ');
        queryCommand = queryCommand.select(fields);
    }

    // Pagination
    const page = +req.query.page || 1;
    const limit = +req.query.limit || process.env.LIMIT_PRODUCTS;
    const skip = (page - 1) * limit;
    queryCommand.skip(skip).limit(limit);

    try {
        const response = await queryCommand.exec();
        const counts = await Sales.find(formatedQueries).countDocuments();

        return res.status(200).json({
            success: response ? true : false,
            counts,
            Saless: response ? response : 'Cannot get Saless',
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
})

//----------------------Xóa 1 Sales, dành cho admin----------------\\
const deleteSales = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (!uid) throw new Error('Missing inputs')
    const response = await Sales.findByIdAndDelete(uid)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `Người dùng có email ${response.email} đã được xóa` : 'Người dùng không bị xóa'
    })
})

//--------------------------Người dùng thay đổi thông tin cá nhân--------------------------\\

const updateSales = asyncHandler(async (req, res) => {
    // 
    const { _id } = req.Sales
    const { firstname, lastname, email, mobile } = req.body
    const data = { firstname, lastname, email, mobile }
    if (req.file) data.avatar = req.file.path
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Chưa nhập thông tin')
    const response = await Sales.findByIdAndUpdate(_id, data, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Cập nhật thành công' : 'Cập nhật thất bại'
    })
})

//-------------Thay đổi thông tin người dùng (chỉ dành cho Admin)--------------\\
const updateSalesByAdmin = asyncHandler(async (req, res) => {
    // 
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Chưa nhận thông tin')
    const response = await Sales.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Cập nhật thành công' : 'Cập nhật không thành công'
    })
})
/*

const finalRegister = asyncHandler(async (req, res) => {
    // const cookie = req.cookies;
    const { token } = req.params;
    // if (!cookie || cookie?.dataregister?.token !== token) {
    //     res.clearCookie('dataregister');
    //     return res.redirect(`${process.env.CLIENT_URL}/final-register/failure`)
    // }
    const notActivedEmail = await Sales.findOne({ email: new RegExp(`${token}$`) })
    if (notActivedEmail) {
        notActivedEmail.email = atob(notActivedEmail?.email?.split('@')[0])
        notActivedEmail.save()
    }
    return res.json({
        success: notActivedEmail ? true : false,
        response: notActivedEmail ? 'Đăng ký thành công ! Hãy đăng nhập ' : 'Có sai sót gì đó .Hãy thử lại sau'
    })
    // const newSales = await Sales.create({
    //     email: cookie?.dataregister?.email,
    //     password: cookie?.dataregister?.password,
    //     mobile: cookie?.dataregister?.mobile,
    //     firstname: cookie?.dataregister?.firstname,
    //     lastname: cookie?.dataregister?.lastname,
    // });
    // res.clearCookie('dataregister');
    // if (newSales) return res.redirect(`${process.env.CLIENT_URL}/final-register/success`)
    // else res.redirect(`${process.env.CLIENT_URL}/final-register/failure`)
})











const updateSalesAddress = asyncHandler(async (req, res) => {
    // 
    const { _id } = req.Sales
    if (!req.body.address) throw new Error('Missing inputs')
    const response = await Sales.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedSales: response ? response : 'Some thing went wrong'
    })
})
const updateCart = asyncHandler(async (req, res) => {
    // 
    const { _id } = req.Sales;
    const { pid, quantity = 1, color, price } = req.body;
    // if (!pid || !color) throw new Error('Missing inputs')
    const Sales = await Sales.findById(_id).select('cart');
    const alreadyProduct = Sales?.cart?.find(el => el.product.toString() === pid)
    if (alreadyProduct && alreadyProduct.color === color) {
        const response = await Sales.updateOne({ cart: { $elemMatch: alreadyProduct } }, { $set: { "cart.$.quantity": quantity, "cart.$.price": price } }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Thành công' : 'Thất bại'
        })
    }
    else {
        const response = await Sales.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color, price } } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Thành công' : 'Thất bại'
        })
    }
})

const removeProductInCart = asyncHandler(async (req, res) => {
    // 
    const { _id } = req.Sales;
    const { pid } = req.params;
    const Sales = await Sales.findById(_id).select('cart');
    const alreadyProduct = Sales?.cart?.find(el => el.product.toString() === pid)
    if (!alreadyProduct) return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Thành công' : 'Thất bại'
    })
    const response = await Sales.findByIdAndUpdate(_id, { $pull: { cart: { product: pid } } }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Thành công' : 'Thất bại'
    })
})
const createSaless = asyncHandler(async (req, res) => {
    const response = await Sales.create(Saless)
    return res.status(200).json({
        success: response ? true : false,
        Saless: response ? response : 'Some thing went wrong'
    })
})*/ 

//-----------------Tạo sản phẩm--------------------\\
const createProduct = asyncHandler(async (req, res) => {
    const { title, price, description, brand, category, color, size } = req.body;
    const thumb = req?.files?.thumb[0]?.path
    const images = req.files?.images?.map(el => el.path)
    if (!(title && price && description && brand && category && color && size)) throw new Error('Chưa cung cấp đủ thông tin cần thiết!')
    req.body.slug = slugify(title) //video9-20:49
    if (thumb) req.body.thumb = thumb
    if (images) req.body.images = images
    const newProduct = await Product.create(req.body)
    return res.status(200).json({
        success: newProduct ? true : false,
        mes: newProduct ? 'Tạo sản phẩm thành công' : 'Tạo sản phẩm thất bại'
    })
})
module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getSaless,
    deleteSales,
    updateSales,
    updateSalesByAdmin,
    createProduct,
    /* 
    
    
    
    
    updateSalesAddress,
    updateCart,
    finalRegister,
    createSaless,
    removeProductInCart */
} 