/* ---------phân quyền người dùng và xác thực người dùng nhờ token---------------- */ 

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const verifyAccessToken = asyncHandler(async (req, res, next) => {
    // Bearer token : token dùng để đăng nhập thường có từ Bearer   
    // để headers: { authorization: Bearer token } thì dùng split cắt thành mảng
    if (req?.headers?.authorization?.startsWith('Bearer')) {
        const token = req.headers.authorization.split(' ')[1]
        //check token
        jwt.verify(token, "${process.env.JWT_SECRET}", (err, decode) => {
            if (err) return res.status(401).json({
                success: false,
                mes: 'Mã token truy cập không hợp lệ!'
            })
            // decode chứa id_user và role 
            //console.log(decode);
            req.user = decode;
            next();
        })
    } else {
        return res.status(401).json({
            success: false,
            mes: 'Không tìm thấy mã token truy cập !!! Yêu cầu xác thực '
        })
    }
})

//------------Phân quyền Admin---------------\\
const isAdmin = asyncHandler((req, res, next) => {
    const { role } = req.user
    if (+role !== 1945)
        return res.status(401).json({
            success: false,
            mes: 'Yêu cầu trao quyền quản trị viên'
        })
    next()
})

//------------Phân quyền Sales-----------------\\
const isSales = asyncHandler((req, res, next) => {
    const { role } = req.user
    if (+role !== 1999)
        return res.status(401).json({
            success: false,
            mes: 'Yêu cầu trao quyền người bán hàng'
        })
    next()
})

module.exports = {
    verifyAccessToken,
    isAdmin,
    isSales
}