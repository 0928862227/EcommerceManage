const User = require('../models/user');
const asyncHandler = require('express-async-handler');
const { generateAccessToken, generateRefreshToken } = require('../middlewares/jwt');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const crypto = require('crypto');


/* 
const makeToken = require('uniqid');
const { users } = require('../ultils/contants') */

//----------ĐĂNG KÝ-TẠO TÀI KHOẢN-----------//

 const register = asyncHandler(async (req, res) => {
     const { email, password, firstname, lastname } = req.body;
     if (!email || !password || !firstname || !lastname)
         return res.status(400).json({
             success: false,
            mes: 'Thiếu thông tin'
        })

     const user = await User.findOne({ email });
     if (user)
         throw new Error('Tài khoản này đã tồn tại');
   else {
         const newUser = await User.create(req.body);
         return res.status(200).json({
             success: newUser ? true : false,
             mes: newUser ? 'Đăng ký thành công ! Hãy đăng nhập ' : 'Có sai sót gì đó .Hãy thử lại sau'
      })
     }
})
/* const register = asyncHandler(async (req, res) => {
    const { email, password, firstname, lastname, mobile } = req.body
    /* catch bug reques api 
    check collections in models/user.js have reques 
    if eny thís collection have no reques 
    then check will detect and not query database /video2- */ 
   /* if (!email || !password || !lastname || !firstname || !mobile)
        return res.status(400).json({
            success: false,
            mes: 'Thiếu thông tin'
        })
    const response = await User.create(req.body)
    return res.status(200).json({
        success: response ? true : false,
        response
    })
  })
  /* check email này đã được register hay chưa và nạp thông tin mới */
   /* const user = await User.findOne({ email });
    if (user)
        throw new Error('Tài khoản này đã tồn tại');
    else {
        const token = makeToken();
        // res.cookie('dataregister', { ...req.body, token }, { httpOnly: true, maxAge: 15 * 60 * 1000 })
        // const html = `xin vui lòng click vào link dưới đây để hoàn tất quá trình đăng ký.Link này sẽ hết hạn sau 15 phút kể từ bây giờ.
        //     <a href = ${process.env.URL_SERVER}/api/user/final-register/${token}>click here</a > `
        const emailedited = btoa(email) + '@' + token
        const newUser = await User.create({
            email: emailedited, password, firstname, lastname, mobile
        })
        if (newUser) {
            const html = `<h2>Register code:</h2><br/><blockquote>${token}</blockquote>`
            await sendMail({ email, html, subject: 'Confirm register account' })
        }
        setTimeout(async () => {
            await User.deleteOne({ email: emailedited })
        }, [300000])
        return res.json({
            success: newUser ? true : false,
            mes: newUser ? 'Please check your email to active your account' : 'Something went wrong, pls try again'
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
    models/user(v4.22:01) */
    const response = await User.findOne({ email }) //25:26 v4 
    // khi đăng nhập thành công
    if (response && await response.isCorrectPassword(password)) {
          /* ẩn thông tin quan trọng như password và role ra khỏi bảng body 
         trên postman và sau này gửi nó về clent để hiển thị trên user */
        const { password, role, refreshToken, ...userData } = response.toObject()

        // Tạo access token khi login
        const accessToken = generateAccessToken(response._id, role)

        // Tạo refresh token khi token ở trên hết hạn
        const newRefreshToken = generateRefreshToken(response._id)
         // Lưu refresh token vào database
        await User.findByIdAndUpdate(response._id, { refreshToken: newRefreshToken }, { new: true })
        // Lưu refresh token vào cookie
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        //đăng nhập thành công thì.. */
        return res.status(200).json({
            success: true,
            accessToken,
            userData
        })
        //đăng nhập thất bại 
    } else {
        throw new Error('Password không đúng hoặc email không tồn tại!')
    }
})

//---------------Lấy thông tin hiện tại của user---------------\\

const getCurrent = asyncHandler(async (req, res) => {
    const { _id } = req.user
    //ko hiển thị 3 tt role ,password,..
    const user = await User.findById(_id).select('-refreshToken -password -role')
    /* .populate({
        path: 'cart',
        populate: {
            path: 'product',
            select: 'title thumb price'
        } 
    })*/
    return res.status(200).json({
        success: user ? true : false,
        rs: user ? user : 'Không tìm thấy thông tin user'
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
    const response = await User.findOne({ _id: rs._id, refreshToken: cookie.refreshToken })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(response._id, response.role) : 'Refresh token không khớp!'
    })
})

//----------------ĐĂNG XUẤT---------------------\\

const logout = asyncHandler(async (req, res) => {
    //check xem user đang ở trạng thái đăng nhập hay không?
    const cookie = req.cookies
    if (!cookie || !cookie.refreshToken) 
    throw new Error('Không có refreshToken trong cookie! Nếu đăng xuất thì lần sau phải đăng nhập lại!!')
    // Xóa refresh token trong db
    await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
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
    const { email,firtname } = req.body
    if (!email) throw new Error('Chưa có email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('Không tìm thấy người dùng')
    const resetToken = user.createPasswordChangedToken()
    await user.save()


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
            <p>Xin Chào ${email},</p>
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
            href="http://localhost:8888/user/api/reset-password/${resetToken}" >Kích Hoạt Mật Khẩu</a>
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
    const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } }) //so sách
    if (!user) throw new Error('Reset Token chưa hợp lệ hoặc đã hết hạn!')
    user.password = password
    user.passwordResetToken = undefined //xóa
    user.passwordChangedAt = Date.now()
    user.passwordResetExpires = undefined
    await user.save()
    return res.status(200).json({
        success: user ? true : false,
        mes: user ? 'Cập nhật mật khẩu thành công' : 'Có gì đó không ổn! Hãy thử lại sau.'
    })
})

//---------------------Hàm lấy thông tin tất cả user ,dành cho admin-----------------\\
const getUsers = asyncHandler(async (req, res) => {
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
    let queryCommand = User.find(formatedQueries);

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
        const counts = await User.find(formatedQueries).countDocuments();

        return res.status(200).json({
            success: response ? true : false,
            counts,
            users: response ? response : 'Cannot get users',
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message,
        });
    }
})

//----------------------Xóa 1 user, dành cho admin----------------\\
const deleteUser = asyncHandler(async (req, res) => {
    const { uid } = req.params
    if (!uid) throw new Error('Missing inputs')
    const response = await User.findByIdAndDelete(uid)
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? `Người dùng có email ${response.email} đã được xóa` : 'Người dùng không bị xóa'
    })
})

//--------------------------Người dùng thay đổi thông tin cá nhân--------------------------\\

const updateUser = asyncHandler(async (req, res) => {
    // 
    const { _id } = req.user
    const { firstname, lastname, email, mobile } = req.body
    const data = { firstname, lastname, email, mobile }
    if (req.file) data.avatar = req.file.path
    if (!_id || Object.keys(req.body).length === 0) throw new Error('Chưa nhập thông tin')
    const response = await User.findByIdAndUpdate(_id, data, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Cập nhật thành công' : 'Cập nhật thất bại'
    })
})

//-------------Thay đổi thông tin người dùng (chỉ dành cho Admin)--------------\\
const updateUserByAdmin = asyncHandler(async (req, res) => {
    // 
    const { uid } = req.params
    if (Object.keys(req.body).length === 0) throw new Error('Chưa nhận thông tin')
    const response = await User.findByIdAndUpdate(uid, req.body, { new: true }).select('-password -role -refreshToken')
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
    const notActivedEmail = await User.findOne({ email: new RegExp(`${token}$`) })
    if (notActivedEmail) {
        notActivedEmail.email = atob(notActivedEmail?.email?.split('@')[0])
        notActivedEmail.save()
    }
    return res.json({
        success: notActivedEmail ? true : false,
        response: notActivedEmail ? 'Đăng ký thành công ! Hãy đăng nhập ' : 'Có sai sót gì đó .Hãy thử lại sau'
    })
    // const newUser = await User.create({
    //     email: cookie?.dataregister?.email,
    //     password: cookie?.dataregister?.password,
    //     mobile: cookie?.dataregister?.mobile,
    //     firstname: cookie?.dataregister?.firstname,
    //     lastname: cookie?.dataregister?.lastname,
    // });
    // res.clearCookie('dataregister');
    // if (newUser) return res.redirect(`${process.env.CLIENT_URL}/final-register/success`)
    // else res.redirect(`${process.env.CLIENT_URL}/final-register/failure`)
})











const updateUserAddress = asyncHandler(async (req, res) => {
    // 
    const { _id } = req.user
    if (!req.body.address) throw new Error('Missing inputs')
    const response = await User.findByIdAndUpdate(_id, { $push: { address: req.body.address } }, { new: true }).select('-password -role -refreshToken')
    return res.status(200).json({
        success: response ? true : false,
        updatedUser: response ? response : 'Some thing went wrong'
    })
})
const updateCart = asyncHandler(async (req, res) => {
    // 
    const { _id } = req.user;
    const { pid, quantity = 1, color, price } = req.body;
    // if (!pid || !color) throw new Error('Missing inputs')
    const user = await User.findById(_id).select('cart');
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
    if (alreadyProduct && alreadyProduct.color === color) {
        const response = await User.updateOne({ cart: { $elemMatch: alreadyProduct } }, { $set: { "cart.$.quantity": quantity, "cart.$.price": price } }, { new: true });
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Thành công' : 'Thất bại'
        })
    }
    else {
        const response = await User.findByIdAndUpdate(_id, { $push: { cart: { product: pid, quantity, color, price } } }, { new: true })
        return res.status(200).json({
            success: response ? true : false,
            mes: response ? 'Thành công' : 'Thất bại'
        })
    }
})

const removeProductInCart = asyncHandler(async (req, res) => {
    // 
    const { _id } = req.user;
    const { pid } = req.params;
    const user = await User.findById(_id).select('cart');
    const alreadyProduct = user?.cart?.find(el => el.product.toString() === pid)
    if (!alreadyProduct) return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Thành công' : 'Thất bại'
    })
    const response = await User.findByIdAndUpdate(_id, { $pull: { cart: { product: pid } } }, { new: true })
    return res.status(200).json({
        success: response ? true : false,
        mes: response ? 'Thành công' : 'Thất bại'
    })
})
const createUsers = asyncHandler(async (req, res) => {
    const response = await User.create(users)
    return res.status(200).json({
        success: response ? true : false,
        users: response ? response : 'Some thing went wrong'
    })
})*/ 
module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout,
    forgotPassword,
    resetPassword,
    getUsers,
    deleteUser,
    updateUser,
    updateUserByAdmin,
    /* 
    
    
    
    
    updateUserAddress,
    updateCart,
    finalRegister,
    createUsers,
    removeProductInCart */
} 